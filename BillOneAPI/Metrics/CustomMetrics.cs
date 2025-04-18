using System.Collections.Concurrent;

namespace BillOneAPI.Metrics;

public static class CustomMetrics
{
    private static readonly ConcurrentDictionary<string, int> _metrics = new();

    public static void Increment(string metricName)
    {
        _metrics.AddOrUpdate(metricName, 1, (_, current) => current + 1);
    }

    public static Dictionary<string, int> GetAllMetrics()
    {
        return _metrics.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
    }

    public static void Reset()
    {
        _metrics.Clear();
    }
}

