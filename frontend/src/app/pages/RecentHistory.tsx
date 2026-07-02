interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  url: string; // NEW: Added URL property
}

interface RecentHistoryProps {
  items: HistoryItem[];
}

export function RecentHistory({ items }: RecentHistoryProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-12 mt-12">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Recent History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <a 
            key={item.id} 
            href={item.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col group cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-all block"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.date}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}