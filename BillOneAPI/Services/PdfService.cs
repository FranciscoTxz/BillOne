using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using BillOneAPI.Models.Entities;

namespace BillOneAPI.Services;

public class PdfService
{
    public byte[] GeneratePdf(Factura factura, Usuario usuario, Emisor emisor, List<TokenE> tokens)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.Letter);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));
                
                page.Header()
                    .Row(row =>
                    {
                        row.RelativeItem()
                            .Column(column =>
                            {
                                column.Item().Text($"{emisor.Nombre}")
                                    .FontSize(14).SemiBold();
                                    
                                column.Item().Text($"RFC: {emisor.RFC}");
                                column.Item().Text($"{emisor.Direccion}");
                                column.Item().Text($"{emisor.Ciudad}, {emisor.Estado}, CP {emisor.CodigoPostal}");
                                column.Item().Text($"Tel: {emisor.Telefono} | Email: {emisor.Email}");
                            });
                    });
                    
                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(column =>
                    {
                        column.Item().Text($"FACTURA #{factura.FacturaID}")
                            .FontSize(16).Bold();
                            
                        column.Item().Text($"Fecha: {factura.CreatedAt:dd/MM/yyyy HH:mm}");
                        
                        // Datos del receptor
                        column.Item().PaddingTop(10).Text("RECEPTOR:")
                            .FontSize(12).Bold();
                            
                        column.Item().Text($"{usuario.Nombre}");
                        column.Item().Text($"RFC: {usuario.RFC}");
                        column.Item().Text($"Regimen Fiscal: {usuario.RegimenFiscal}");
                        column.Item().Text($"Uso CFDI: {usuario.UsoCFDI}");
                        
                        // Tabla de conceptos
                        column.Item().PaddingTop(15).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(2, Unit.Centimetre); // Cantidad
                                columns.RelativeColumn(3); // Descripción
                                columns.ConstantColumn(3, Unit.Centimetre); // Precio Unitario
                                columns.ConstantColumn(3, Unit.Centimetre); // Importe
                            });
                            
                            table.Header(header =>
                            {
                                header.Cell().Text("Cantidad").Bold();
                                header.Cell().Text("Descripción").Bold();
                                header.Cell().Text("Precio Unitario").Bold();
                                header.Cell().Text("Importe").Bold();
                            });
                            
                            foreach (var token in tokens)
                            {
                                table.Cell().Text("1");
                                table.Cell().Text(token.Concepto);
                                table.Cell().Text($"${token.Monto:N2}");
                                table.Cell().Text($"${token.Monto:N2}");
                            }
                        });
                        
                        // Totales
                        column.Item().AlignRight().Text($"Subtotal: ${factura.Total:N2}");
                        column.Item().AlignRight().Text($"IVA (16%): ${factura.Total * 0.16m:N2}");
                        column.Item().AlignRight().Text($"Total: ${factura.Total * 1.16m:N2}").Bold();
                    });
                    
                page.Footer()
                    .AlignCenter()
                    .Text(text =>
                    {
                        text.Span("Este documento es una previsualización y no tiene validez fiscal.");
                        text.Span(" ");
                        text.Span($"Generado el {DateTime.Now:dd/MM/yyyy HH:mm}");
                    });
            });
        });
        
        return document.GeneratePdf();
    }
}