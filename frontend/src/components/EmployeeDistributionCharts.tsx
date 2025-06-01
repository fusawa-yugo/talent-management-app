"use client";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Employee } from "../models/Employee";

type Props = {
  employees: Employee[] | undefined;
};

type Distribution = {
  name: string;
  count: number;
};

function getDistribution(data: (string | undefined)[]): Distribution[] {
  const counts = data.reduce(
    (acc, item) => {
      if (!item) return acc;
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function getSkillDistribution(data: Employee[]): Distribution[] {
  const counts: Record<string, number> = {};
  for (const emp of data) {
    for (const skill of emp.skills) {
      const trimmed = skill.trim();
      counts[trimmed] = (counts[trimmed] || 0) + 1;
    }
  }

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

export default function EmployeeDistributionCharts({ employees }: Props) {
  const departmentData = useMemo(
    () => getDistribution(employees?.map((e) => e.department) || []),
    [employees],
  );
  const positionData = useMemo(
    () => getDistribution(employees?.map((e) => e.position) || []),
    [employees],
  );
  const skillData = useMemo(
    () => getSkillDistribution(employees || []),
    [employees],
  );

  if (!employees) return <p>Loading distribution...</p>;

  return (
    <Box sx={{ display: "grid", gap: 4 }}>
      <Typography variant="h6">Department Distribution</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={departmentData}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#ccc" />
          <Bar dataKey="count" fill="#8884d8" name="Employees" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6">Position Distribution</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={positionData}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#ccc" />
          <Bar dataKey="count" fill="#82ca9d" name="Employees" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6">Skill Distribution</Typography>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={skillData} margin={{ bottom: 200 }}>
          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#ccc" />
          <Bar dataKey="count" fill="#ffc658" name="Employees" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
