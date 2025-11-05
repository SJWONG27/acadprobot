package com.acadprobot.admin.service;

import com.acadprobot.admin.model.UnrelatedQueries;
import com.acadprobot.admin.repository.UnrelatedQueriesRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.*;
import java.util.*;


@Service
public class UnrelatedQueriesService {
    @Autowired
    private UnrelatedQueriesRepository unrelatedQueriesRepository;

    public ByteArrayInputStream exportToExcel() throws IOException {
        String[] columns = {"ID", "User ID", "Chatbot ID", "Query Text", "Created At"};
        List<UnrelatedQueries> queries = unrelatedQueriesRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Unrelated Queries");
            Row headerRow = sheet.createRow(0);

            // Header
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            // Data
            int rowIdx = 1;
            for (UnrelatedQueries q : queries) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(q.getId().toString());
                row.createCell(1).setCellValue(q.getUserId().toString());
                row.createCell(2).setCellValue(q.getChatbotId().toString());
                row.createCell(3).setCellValue(q.getQueryText());
                row.createCell(4).setCellValue(q.getCreated_at().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
