"use client";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { Employee } from "../models/Employee";
import SearchResultField from "./SearchResultField";

type Props = {
  employees: Employee[] | undefined;
  departments: string[];
  positions: string[];
  skills: string[];
  sortKeys: string[];
  departmentFilter: string;
  setDepartmentFilter: (v: string) => void;
  positionFilter: string;
  setPositionFilter: (v: string) => void;
  skillFilter: string;
  setSkillFilter: (v: string) => void;
  sortKey: string;
  setSortKey: (v: string) => void;
};

export function EmployeeListContainer({
  employees = [],
  departments,
  positions,
  skills,
  sortKeys,
  departmentFilter,
  setDepartmentFilter,
  positionFilter,
  setPositionFilter,
  skillFilter,
  setSkillFilter,
  sortKey,
  setSortKey,
}: Props) {
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

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortKey}
            label="SortKey"
            onChange={(e: SelectChangeEvent) => setSortKey(e.target.value)}
          >
            {sortKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <SearchResultField employees={employees} />
    </>
  );
}
