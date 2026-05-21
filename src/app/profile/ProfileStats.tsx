import type { ProfileStats as ProfileStatsType } from "@/lib/db/items";
import { iconsByLucideName } from "@/lib/type-icons";

interface ProfileStatsProps {
  stats: ProfileStatsType;
}

function pluralLabel(name: string, count: number) {
  const titled = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return count === 1 ? titled : `${titled}s`;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">Usage</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Total items
          </p>
          <p className="mt-1 text-2xl font-semibold">{stats.totalItems}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Total collections
          </p>
          <p className="mt-1 text-2xl font-semibold">{stats.totalCollections}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Breakdown by type
        </p>
        <ul className="flex flex-col gap-2">
          {stats.byType.map((type) => {
            const Icon = type.icon ? iconsByLucideName[type.icon] : null;
            const empty = type.count === 0;
            return (
              <li
                key={type.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  {Icon ? (
                    <Icon
                      className="size-4"
                      style={{
                        color: empty
                          ? undefined
                          : (type.color ?? undefined),
                      }}
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={
                      empty ? "text-muted-foreground" : "text-foreground"
                    }
                  >
                    {pluralLabel(type.name, type.count)}
                  </span>
                </span>
                <span
                  className={
                    empty
                      ? "tabular-nums text-muted-foreground"
                      : "tabular-nums text-foreground"
                  }
                >
                  {type.count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
