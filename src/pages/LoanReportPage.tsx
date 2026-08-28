import { Box, Stack, Typography } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

export function LoanReportPage() {
  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, }}>
        <AssessmentOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }}/>
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Reportes
        </Typography>
      </Stack>
    </Box>
  );
}