import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { type Employee, EmployeeT } from "../models/Employee";

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

export function useFilteredEmployees(filterText: string) {
  const encoded = encodeURIComponent(filterText);
  const { data, error, isLoading } = useSWR<Employee[], Error>(
    `/api/employees?filterText=${encoded}`,
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

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((employee) => {
      const matchesDepartment =
        departmentFilter === "" || employee.department === departmentFilter;
      const matchesPosition =
        positionFilter === "" || employee.position === positionFilter;
      const matchesSkill =
        skillFilter === "" || employee.skills.includes(skillFilter);
      return matchesDepartment && matchesPosition && matchesSkill;
    });
  }, [data, departmentFilter, positionFilter, skillFilter]);

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

  return {
    filteredEmployees: filtered,
    departments,
    positions,
    skills,
    departmentFilter,
    setDepartmentFilter,
    positionFilter,
    setPositionFilter,
    skillFilter,
    setSkillFilter,
    isLoading,
    error,
  };
}
