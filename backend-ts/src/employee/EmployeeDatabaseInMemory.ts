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

  // 氏名の部分一致
  partialMatchOnName(employee : Employee, filterText : string) : boolean {
    // すべて小文字に変換
    const lowerName : string = employee.name.toLowerCase();
    const lowerNameEn : string = employee.name_en.toLowerCase();
    const lowerFilter : string = filterText.toLowerCase();
    // スペースを除去
    const lowerNameReplaced : string = lowerName.replace(/\s+/g, "");
    const lowerNameEnReplaced : string = lowerNameEn.replace(/\s+/g, "");
    const lowerFilterReplaced : string = lowerFilter.replace(/\s+/g, "");
    return (lowerName.indexOf(lowerFilter) > -1) || (lowerNameReplaced.indexOf(lowerFilterReplaced) > -1)
        || (lowerNameEn.indexOf(lowerFilter) > -1) || (lowerNameEnReplaced.indexOf(lowerFilterReplaced) > -1);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployees(filterText: string): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());
    if (filterText === "") {
      return employees;
    }
    return employees.filter((employee) => this.partialMatchOnName(employee, filterText));
  }
}
