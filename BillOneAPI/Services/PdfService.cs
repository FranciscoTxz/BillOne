using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BillOneAPI.Services;

public class PdfService : IDocument
{
    public required int Plantilla { get; set; }
    public required string Titulo { get; set; }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        switch (Plantilla)
        {
            case 0:
                GenerateTemplate0(container);
                break;
            case 1:
                GenerateTemplate1(container);
                break;
            default:
                GenerateTemplate0(container);
                break;
        }
    }

    private void GenerateTemplate0(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(50);
            page.Size(PageSizes.A4);
            page.PageColor(Colors.White);

            page.Content()
                .Column(col =>
                {
                    col.Item().Text(Titulo).FontSize(20).Bold();
                    col.Item().Text("Este es un documento PDF generado desde una Web API.");
                });
        });
    }
    private void GenerateTemplate1(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(50);
            
                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);

                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
    }

    void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item()
                    .Text($"Invoice XYZ")
                    .FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

                column.Item().Text(text =>
                {
                    text.Span("Issue date: ").SemiBold();
                    text.Span("2010-01-01");
                });
                
                column.Item().Text(text =>
                {
                    text.Span("Due date: ").SemiBold();
                    text.Span($"{DateTime.Now.AddDays(30):yyyy-MM-dd}");
                });
            });

            row.ConstantItem(100).Height(50).Placeholder();
        });
    }

    void ComposeContent(IContainer container)
    {
        container.PaddingVertical(40).Column(column =>
        {
            column.Spacing(5);

            column.Item().Element(ComposeTable);

            if (!string.IsNullOrWhiteSpace("XYZ"))
                column.Item().PaddingTop(25).Element(ComposeComments);
        });
    }

    void ComposeTable(IContainer container)
    {
        container
            .Height(250)
            .Background(Colors.Grey.Lighten3)
            .AlignCenter()
            .AlignMiddle()
            .Text("Table").FontSize(16);
    }

    void ComposeComments(IContainer container)
    {
        container.Background(Colors.Grey.Lighten3).Padding(10).Column(column =>
        {
            column.Spacing(5);
            column.Item().Text("Comments").FontSize(14);
            column.Item().Text("XYZ");
        });
    }
}


// EXAMPLE : https://www.questpdf.com/getting-started.html
