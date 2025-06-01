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

export const useFilteredEmployees = (filterText: string) => {
  const encodedFilterText = encodeURIComponent(filterText);
  const { data, error, isLoading } = useSWR<Employee[], Error>(
    `/api/employees?filterText=${encodedFilterText}`,
    employeesFetcher,
  );

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Employee>("id");

  useEffect(() => {
    if (error != null) {
      console.error("Failed to fetch employees filtered by filterText", error);
    }
  }, [error]);

  const departments = useMemo(
    () => Array.from(new Set(data?.map((e) => e.department) || [])),
    [data],
  );

  const positions = useMemo(
    () => Array.from(new Set(data?.map((e) => e.position) || [])),
    [data],
  );

  const skills = useMemo(
    () =>
      Array.from(
        new Set(data?.flatMap((e) => e.skills.map((s) => s.trim())) || []),
      ),
    [data],
  );

  const sortKeys = useMemo((): (keyof Employee)[] => {
    if (!data || data.length === 0) {
      return [];
    }
    return (Object.keys(data[0]) as (keyof Employee)[]).filter(
      (key) => key !== "skills",
    );
  }, [data]);

  const filteredData = useMemo(() => {
    const result = data
      ?.filter((employee) => {
        const matchesDepartment =
          departmentFilter === "" || employee.department === departmentFilter;
        const matchesPosition =
          positionFilter === "" || employee.position === positionFilter;
        const matchesSkill =
          skillFilter === "" || employee.skills.includes(skillFilter);
        return matchesDepartment && matchesPosition && matchesSkill;
      })
      ?.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return aValue === bValue ? 0 : aValue ? -1 : 1;
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return aValue - bValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }
        return 0;
      });

    return result;
  }, [data, departmentFilter, positionFilter, skillFilter, sortKey]);

  return {
    employees: filteredData,
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
    isLoading,
  };
};
