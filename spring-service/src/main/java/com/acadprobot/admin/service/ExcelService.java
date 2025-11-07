package com.acadprobot.admin.service;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    public List<String> extractEmailsFromExcel(MultipartFile file) throws Exception {
        List<String> emails = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0); // First sheet
            Iterator<Row> rows = sheet.iterator();

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                Cell cell = currentRow.getCell(0); // assume first column has emails

                if (cell != null && cell.getCellType() == CellType.STRING) {
                    String email = cell.getStringCellValue().trim();
                    if (!email.isEmpty()) {
                        emails.add(email);
                    }
                }
            }
        }

        return emails;
    }
}
