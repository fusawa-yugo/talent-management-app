// import dotenv from "dotenv";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { ParamsDictionary } from "express-serve-static-core";
// import fetch from "node-fetch";
import type { Employee } from "./employee/Employee";
import { EmployeeDatabaseInMemory } from "./employee/EmployeeDatabaseInMemory";
import { parse } from "csv-parse/sync";
import multer from "multer";

// dotenv.config();
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = `${process.env.GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
// if (GEMINI_API_KEY && GEMINI_API_URL) {
//   console.log("Successfully loaded GEMINI_API_KEY and GEMINI_API_URL.");
// } else {
//   console.error(
//     "GEMINI_API_KEY or GEMINI_API_URL is not defined in environment variables."
//   );
// }

// interface GeminiCandidate {
//   content?: {
//     parts?: Array<{
//       text?: string;
//     }>;
//   };
// }

// interface GeminiResponse {
//   candidates?: GeminiCandidate[];
//   promptFeedback?: unknown;
// }

type CSVRecord = Omit<Employee, "id" |"skills" | "age"> & {
  age: string; 
  skills?: string;
}

const upload = multer()

interface MulterRequest extends Request {
  file: Express.Multer.File; 
}

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

app.use(express.json());

app.get("/api/employees", async (req: Request, res: Response) => {
  const filterText = req.query.filterText ?? "";
  // req.query is parsed by the qs module.
  // https://www.npmjs.com/package/qs
  if (Array.isArray(filterText)) {
    // Multiple filterText is not supported
    res.status(400).send();
    return;
  }
  if (typeof filterText !== "string") {
    // Nested query object is not supported
    res.status(400).send();
    return;
  }
  try {
    const employees = await database.getEmployees(filterText);
    res.status(200).send(JSON.stringify(employees));
  } catch (e) {
    console.error(`Failed to load the users filtered by ${filterText}.`, e);
    res.status(500).send();
  }
});

app.post("/api/register-employee", async (req: Request, res: Response) => {
  const employee = req.body;
  await database.registerEmployee(employee);
  res.status(201).send();
});

app.post(
  "/api/register-csv",
  upload.single("csvfile"), // フィールド名はフロントのFormDataのキーと合わせる
  async (req: Request, res: Response) => {
    const multerReq = req as MulterRequest;
    if (!multerReq.file) {
      res.status(400).send("CSVファイルがアップロードされていません。");
      return;
    }
    try {
      if (!multerReq.file) {
        res.status(400).send("CSVファイルがアップロードされていません。");
        return;
      }
      // ファイルのバッファを文字列に変換
      const csvData = multerReq.file.buffer.toString("utf-8");
      if (!csvData) {
        res.status(400).send("CSV data is empty.");
        return;
      }
      const rawRecords: CSVRecord[]  = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
      });

      const employees: Omit<Employee, "id">[] = rawRecords.map((record) => {
        return {
          name: record.name,
          name_en: record.name_en,
          age: parseInt(record.age, 10),
          department: record.department,
          position: record.position,
          skills: record.skills ? record.skills.split("/").map((s) => s.trim()) : [],
        }})
      employees.forEach(async (employee) => {
        await database.registerEmployee(employee);
      })
      res.status(201).send("CSVファイルから従業員情報を登録しました。");
      return;
    } catch (e) {
      console.error("Failed to register employees from CSV.", e);
      res.status(500).send("Failed to register employees from CSV.");
      return;
    }
  }
);

app.get("/api/employees/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const employee = await database.getEmployee(userId);
    if (employee === undefined) {
      res.status(404).send();
      return;
    }
    res.status(200).send(JSON.stringify(employee));
  } catch (e) {
    console.error(`Failed to load the user ${userId}.`, e);
    res.status(500).send();
  }
});

const handleEmployeeSummary = (
  req: Request<ParamsDictionary, unknown, Employee>,
  res: Response,
  next: NextFunction,
): void => {
  const employee = req.body;

  if (!employee || typeof employee !== "object" || !employee.name) {
    res.status(400).json({ message: "Invalid employee data in request body" });
    return;
  }

  //   const prompt = `以下の従業員情報を簡潔に要約してください:
  // 名前: ${employee.name}
  // 年齢: ${employee.age}歳
  // 部署: ${employee.department}
  // 役職: ${employee.position}
  // スキル: ${employee.skills.join(", ")}

  // 要約結果:`;

  //   if (!GEMINI_API_URL) {
  //     console.error("GEMINI_API_URL is not defined.");
  //     res.status(500).json({
  //       message: "GEMINI_API_URL is not defined in environment variables.",
  //     });
  //     return;
  //   }

  // fetch(GEMINI_API_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     contents: [{ parts: [{ text: prompt }] }],
  //   }),
  // })
  //   .then((geminiResponse) => {
  //     if (!geminiResponse.ok) {
  //       return geminiResponse.text().then((errorBody) => {
  //         console.error("Gemini API error:", geminiResponse.status, errorBody);
  //         throw new Error(
  //           `Gemini API request failed with status ${geminiResponse.status}`,
  //         );
  //       });
  //     }
  //     return geminiResponse.json();
  //   })
  //   .then((data) => {
  //     const summaryText =
  //       (data as GeminiResponse)?.candidates?.[0]?.content?.parts?.[0]?.text ||
  //       "概要を生成できませんでした。";
  //     res.status(200).json({ summary: summaryText.trim() });
  //   })
  //   .catch((error) => {
  //     console.error("Error in /api/employee/summary route:", error);
  //     next(error);
  //   });
  res.status(200).json({ summary: "ダミーサマリです。" });
};

app.post("/api/employee/summary", handleEmployeeSummary);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
});
