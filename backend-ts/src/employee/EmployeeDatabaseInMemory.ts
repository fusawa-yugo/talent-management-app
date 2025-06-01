import type { Employee } from "./Employee";
import type { EmployeeDatabase } from "./EmployeeDatabase";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
  private employees: Map<string, Employee>;

  constructor() {
    this.employees = new Map<string, Employee>();
    this.employees.set("1", {
      id: "1",
      name: "Jane Doe",
      name_en: "Jane Doe",
      age: 22,
      department: "Engineering",
      position: "Software Engineer",
      skills: ["JavaScript", "TypeScript"],
    });
    this.employees.set("2", {
      id: "2",
      name: "John Smith",
      name_en: "John Smith",
      age: 28,
      department: "Marketing",
      position: "Marketing Specialist",
      skills: ["SEO", "Content Marketing"],
    });
    this.employees.set("3", {
      id: "3",
      name: "山田 太郎",
      name_en: "Taro Yamada",
      age: 27,
      department: "Sales",
      position: "Sales Representative",
      skills: ["Negotiation", "Customer Relationship Management"],
    });
  }

  // 各名前で検索
  partialMatchByName(name: string, filterText: string): boolean {
    const lowerName: string = name.toLowerCase();
    const lowerNameReplaced: string = lowerName.replace(/\s+/g, "");
    const lowerFilter: string = filterText.toLowerCase();

    return (
      lowerName.indexOf(lowerFilter) > -1 ||
      lowerNameReplaced.indexOf(lowerFilter) > -1
    );
  }

  // 各個人で名前の部分一致検索
  partialMatchByEmployee(employee: Employee, filterText: string): boolean {
    return (
      this.partialMatchByName(employee.name, filterText) ||
      this.partialMatchByName(employee.name_en, filterText)
    );
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployees(filterText: string): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());
    if (filterText === "") {
      return employees;
    }
    return employees.filter((employee) =>
      this.partialMatchByEmployee(employee, filterText),
    );
  }
}
