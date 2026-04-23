package com.smartcampus.backend.controller;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.repository.TicketRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.awt.Color;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/pdf")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminPdfReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    private static final Color PRIMARY = new Color(14, 116, 219);
    private static final Color PRIMARY_DARK = new Color(15, 23, 42);
    private static final Color HEADER_BG = new Color(226, 232, 240);
    private static final Color ROW_ALT = new Color(248, 250, 252);
    private static final Color BORDER = new Color(203, 213, 225);
    private static final DateTimeFormatter DATE_TIME_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping("/bookings")
    public void exportBookings(HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=bookings-report.pdf");

        Document document = new Document(PageSize.A4.rotate(), 30, 30, 40, 45);
        PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
        writer.setPageEvent(new PdfFooterPageEvent("Bookings Report"));

        document.open();

        addReportHeader(document, "Bookings Report", "Campus booking activity summary");

        PdfPTable table = new PdfPTable(new float[]{1.0f, 2.2f, 2.4f, 1.8f, 2.1f, 1.5f});
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        addTableHeader(table, "ID", "User", "Resource", "Date", "Time", "Status");

        List<Booking> bookings = bookingRepository.findAll();

        int rowIndex = 0;
        for (Booking b : bookings) {
            addTableCell(table, safe(b.getId()), rowIndex);
            addTableCell(table, safe(b.getUserName()), rowIndex);
            addTableCell(table, safe(b.getResourceName()), rowIndex);
            addTableCell(table, safe(b.getBookingDate()), rowIndex);
            addTableCell(table, safe(b.getStartTime()) + " - " + safe(b.getEndTime()), rowIndex);
            addTableCell(table, safe(b.getStatus()), rowIndex);
            rowIndex++;
        }

        if (bookings.isEmpty()) {
            addEmptyState(document, "No booking data available.");
        } else {
            document.add(table);
        }

        document.close();
    }

    @GetMapping("/tickets")
    public void exportTickets(HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=tickets-report.pdf");

        Document document = new Document(PageSize.A4.rotate(), 30, 30, 40, 45);
        PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
        writer.setPageEvent(new PdfFooterPageEvent("Tickets Report"));

        document.open();

        addReportHeader(document, "Tickets Report", "Campus maintenance and issue tracking summary");

        PdfPTable table = new PdfPTable(new float[]{0.8f, 2.5f, 2.2f, 2.2f, 1.4f, 1.4f});
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        addTableHeader(table, "ID", "Title", "Created By", "Assigned To", "Priority", "Status");

        List<Ticket> tickets = ticketRepository.findAll();

        int rowIndex = 0;
        for (Ticket t : tickets) {
            addTableCell(table, safe(t.getId()), rowIndex);
            addTableCell(table, safe(t.getTitle()), rowIndex);
            addTableCell(table, safe(t.getCreatedByEmail()), rowIndex);
            addTableCell(table, safe(t.getAssignedTechnicianEmail()), rowIndex);
            addTableCell(table, safe(t.getPriority()), rowIndex);
            addTableCell(table, safe(t.getStatus()), rowIndex);
            rowIndex++;
        }

        if (tickets.isEmpty()) {
            addEmptyState(document, "No ticket data available.");
        } else {
            document.add(table);
        }

        document.close();
    }

    @GetMapping("/resources")
    public void exportResources(HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=resources-report.pdf");

        Document document = new Document(PageSize.A4.rotate(), 30, 30, 40, 45);
        PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
        writer.setPageEvent(new PdfFooterPageEvent("Resources Report"));

        document.open();

        addReportHeader(document, "Resources Report", "Campus resource inventory summary");

        PdfPTable table = new PdfPTable(new float[]{0.8f, 2.4f, 2.0f, 2.3f, 1.2f, 1.7f});
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        addTableHeader(table, "ID", "Name", "Type", "Location", "Capacity", "Status");

        List<Resource> resources = resourceRepository.findAll();

        int rowIndex = 0;
        for (Resource r : resources) {
            addTableCell(table, safe(r.getId()), rowIndex);
            addTableCell(table, safe(r.getResourceName()), rowIndex);
            addTableCell(table, safe(r.getResourceType()), rowIndex);
            addTableCell(table, safe(r.getLocation()), rowIndex);
            addTableCell(table, safe(r.getCapacity()), rowIndex);
            addTableCell(table, safe(r.getAvailabilityStatus()), rowIndex);
            rowIndex++;
        }

        if (resources.isEmpty()) {
            addEmptyState(document, "No resource data available.");
        } else {
            document.add(table);
        }

        document.close();
    }

    private void addReportHeader(Document document, String reportTitle, String subtitle) throws Exception {
        PdfPTable banner = new PdfPTable(1);
        banner.setWidthPercentage(100);

        PdfPCell bannerCell = new PdfPCell();
        bannerCell.setBackgroundColor(PRIMARY);
        bannerCell.setBorder(Rectangle.NO_BORDER);
        bannerCell.setPadding(16f);

        Font campusFont = new Font(Font.HELVETICA, 24, Font.BOLD, Color.WHITE);
        Font reportFont = new Font(Font.HELVETICA, 13, Font.NORMAL, Color.WHITE);

        Paragraph campus = new Paragraph("Smart Campus", campusFont);
        campus.setSpacingAfter(4f);

        Paragraph report = new Paragraph(reportTitle, reportFont);

        bannerCell.addElement(campus);
        bannerCell.addElement(report);
        banner.addCell(bannerCell);

        document.add(banner);

        PdfPTable meta = new PdfPTable(2);
        meta.setWidthPercentage(100);
        meta.setSpacingBefore(12f);
        meta.setWidths(new float[]{1f, 1f});

        meta.addCell(buildMetaCell("Generated On", LocalDateTime.now().format(DATE_TIME_FORMAT)));
        meta.addCell(buildMetaCell("Report Scope", subtitle));

        document.add(meta);
    }

    private PdfPCell buildMetaCell(String label, String value) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10f);
        cell.setBorderColor(BORDER);
        cell.setBackgroundColor(Color.WHITE);

        Font labelFont = new Font(Font.HELVETICA, 9, Font.BOLD, PRIMARY_DARK);
        Font valueFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.DARK_GRAY);

        Paragraph p1 = new Paragraph(label, labelFont);
        p1.setSpacingAfter(3f);
        Paragraph p2 = new Paragraph(value, valueFont);

        cell.addElement(p1);
        cell.addElement(p2);
        return cell;
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, PRIMARY_DARK);

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(HEADER_BG);
            cell.setBorderColor(BORDER);
            cell.setPadding(8f);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(cell);
        }
    }

    private void addTableCell(PdfPTable table, String value, int rowIndex) {
        Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL, PRIMARY_DARK);

        PdfPCell cell = new PdfPCell(new Phrase(value, cellFont));
        cell.setPadding(8f);
        cell.setBorderColor(BORDER);
        cell.setBackgroundColor(rowIndex % 2 == 0 ? Color.WHITE : ROW_ALT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private void addEmptyState(Document document, String message) throws Exception {
        Font emptyFont = new Font(Font.HELVETICA, 12, Font.ITALIC, Color.GRAY);
        Paragraph empty = new Paragraph(message, emptyFont);
        empty.setSpacingBefore(20f);
        empty.setAlignment(Element.ALIGN_CENTER);
        document.add(empty);
    }

    private String safe(Object value) {
        return value == null ? "" : value.toString();
    }

    static class PdfFooterPageEvent extends PdfPageEventHelper {
        private final String reportName;

        PdfFooterPageEvent(String reportName) {
            this.reportName = reportName;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(2);
            try {
                footer.setWidths(new int[]{3, 1});
                footer.setTotalWidth(document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin());

                Font footerFont = new Font(Font.HELVETICA, 9, Font.ITALIC, Color.GRAY);

                PdfPCell left = new PdfPCell(new Phrase("Confidential • Smart Campus Administration • " + reportName, footerFont));
                left.setBorder(Rectangle.TOP);
                left.setBorderColor(BORDER);
                left.setPaddingTop(6f);
                left.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell right = new PdfPCell(new Phrase("Page " + writer.getPageNumber(), footerFont));
                right.setBorder(Rectangle.TOP);
                right.setBorderColor(BORDER);
                right.setPaddingTop(6f);
                right.setHorizontalAlignment(Element.ALIGN_RIGHT);

                footer.addCell(left);
                footer.addCell(right);

                footer.writeSelectedRows(
                        0,
                        -1,
                        document.leftMargin(),
                        document.bottomMargin() - 8,
                        writer.getDirectContent()
                );
            } catch (Exception ignored) {
            }
        }
    }
}