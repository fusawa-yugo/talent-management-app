"use client";
import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { type Employee, EmployeeT } from "../models/Employee";
import { EmployeeListItem } from "./EmployeeListItem";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

export type EmployeesContainerProps = {
  filterText: string;
  viewMode: "list" | "tile";
};

const EmployeesT = t.array(EmployeeT);

const employeesFetcher = async (url: string): Promise<Employee[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees at ${url}`);
  }
  const body = await response.json();
  const decoded = EmployeesT.decode(body);
  if (isLeft(decoded)) {
    throw new Error(`Failed to decode employees ${JSON.stringify(body)}`);
  }
  return decoded.right;
};

export function EmployeeListContainer({
  filterText,
  viewMode,
}: EmployeesContainerProps) {
  const encodedFilterText = encodeURIComponent(filterText);
  const { data, error, isLoading } = useSWR<Employee[], Error>(
    `/api/employees?filterText=${encodedFilterText}`,
    employeesFetcher
  );

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    if (error != null) {
      console.error("Failed to fetch employees filtered by filterText", error);
    }
  }, [error]);

  const departments = useMemo(
    () => Array.from(new Set(data?.map((e) => e.department) || [])),
    [data]
  );
  const positions = useMemo(
    () => Array.from(new Set(data?.map((e) => e.position) || [])),
    [data]
  );
  const skills = useMemo(
    () =>
      Array.from(
        new Set(data?.flatMap((e) => e.skills.map((s) => s.trim())) || [])
      ),
    [data]
  );

  const filteredData = data?.filter((employee) => {
    const matchesDepartment =
      departmentFilter === "" || employee.department === departmentFilter;
    const matchesPosition =
      positionFilter === "" || employee.position === positionFilter;
    const matchesSkill =
      skillFilter === "" || employee.skills.includes(skillFilter);
    return matchesDepartment && matchesPosition && matchesSkill;
  });

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Department</InputLabel>
          <Select
            value={departmentFilter}
            label="Department"
            onChange={(e: SelectChangeEvent) =>
              setDepartmentFilter(e.target.value)
            }
          >
            <MenuItem value="">All</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Position</InputLabel>
          <Select
            value={positionFilter}
            label="Position"
            onChange={(e: SelectChangeEvent) =>
              setPositionFilter(e.target.value)
            }
          >
            <MenuItem value="">All</MenuItem>
            {positions.map((pos) => (
              <MenuItem key={pos} value={pos}>
                {pos}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Skill</InputLabel>
          <Select
            value={skillFilter}
            label="Skill"
            onChange={(e: SelectChangeEvent) => setSkillFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {skills.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredData && filteredData.length > 0 ? (
        viewMode === "tile" ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {filteredData.map((employee) => (
              <EmployeeListItem employee={employee} key={employee.id} />
            ))}
          </Box>
        ) : (
          filteredData.map((employee) => (
            <EmployeeListItem employee={employee} key={employee.id} />
          ))
        )
      ) : (
        <p>No employees match the filter criteria.</p>
      )}
    </>
  );
}
