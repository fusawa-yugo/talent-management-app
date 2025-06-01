"use client";

import type { Employee } from "@/models/Employee";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type informationProps = Omit<Employee, "id">;

const RegisterEmployee = () => {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const skillsInput = formData.get("skills") as string | null;
    const skills = skillsInput
      ? skillsInput.split("/").map((skill) => skill.trim())
      : [];

    const employeeData: informationProps = {
      name: formData.get("name") as string,
      name_en: formData.get("name_en") as string,
      age: Number(formData.get("age")),
      department: formData.get("department") as string,
      position: formData.get("position") as string,
      skills: skills,
    };

    fetch("/api/register-employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    })
      .then((response) => {
        if (response.ok) {
          alert("従業員情報が登録されました。");
          router.push("/");
          return;
        }
      })
      .catch((error) => {
        alert(`従業員情報の登録中にエラーが発生しました: ${error.message}`);
      });
  };

  const handleCSVSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const csvFileInput = formData.get("csvfile") as File | null;
    if (!csvFileInput || csvFileInput.size === 0) {
      alert("CSVファイルを選択してください。");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("csvfile", csvFileInput);

    fetch("/api/register-csv", {
      method: "POST",
      body: uploadData,
    })
      .then((response) => {
        if (response.ok) {
          alert("CSVファイルが正常にアップロードされました。");
          router.push("/");
          return;
        }
      })
      .catch((error) => {
        alert(
          `CSVファイルのアップロード中にエラーが発生しました: ${error.message}`,
        );
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        登録
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 500,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <TextField label="名前" name="name" required />
          <TextField label="名前(英語)" name="name_en" required />
        </Box>
        <TextField label="年齢" name="age" type="number" required />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <TextField label="部署" name="department" required />
          <TextField label="役職" name="position" required />
        </Box>
        <TextField
          label="スキル"
          name="skills"
          helperText="スラッシュ区切りで入力"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-end" }}
        >
          登録
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleCSVSubmit}
        encType="multipart/form-data"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 500,
          gap: 2,
          marginTop: 4,
        }}
      >
        <input type="file" accept=".csv" name="csvfile" />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-end" }}
        >
          CSV登録
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterEmployee;
