import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Trash2,
  MapPin,
  Recycle,
  Leaf,
  Flame,
  Newspaper,
  Search
} from "lucide-react";

const YEAR = 2026;
const TODAY = new Date();

const FRACTIONS = {
  mixed: { label: "Zmieszane", icon: Trash2 },
  paper: { label: "Papier", icon: Newspaper },
  plastic: { label: "Plastik / Metale", icon: Recycle },
  glass: { label: "Szkło", icon: Trash2 },
  bio: { label: "Bio", icon: Leaf },
  ash: { label: "Popiół", icon: Flame },
};

const schedule = {
  "Rejon I": {
    streets: ["Konstytucji 3 Maja", "Nad Łomnicą", "Ogrodnicza"],
    mixed: ["2026-04-20", "2026-04-27", "2026-05-04"],
    paper: ["2026-04-27", "2026-05-11"],
    plastic: ["2026-04-20", "2026-05-04"],
    glass: ["2026-04-20", "2026-05-04"],
    bio: ["2026-04-18", "2026-04-25", "2026-05-02"],
    ash: ["2026-04-25"],
  },
  "Rejon II": {
    streets: ["Przemysłowa", "Dolna", "Kolejowa"],
    mixed: ["2026-04-21", "2026-04-28"],
    paper: ["2026-04-28"],
    plastic: ["2026-04-21"],
    glass: ["2026-04-21"],
    bio: ["2026-04-18", "2026-04-25"],
    ash: ["2026-04-25"],
  },
  "Rejon III": {
    streets: ["Karkonoska", "Skalna", "Myśliwska"],
    mixed: ["2026-04-22", "2026-04-29"],
    paper: ["2026-04-29"],
    plastic: ["2026-04-22"],
    glass: ["2026-04-22"],
    bio: ["2026-04-18", "2026-04-25"],
    ash: ["2026-04-25"],
  },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const diff = target - TODAY;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUpcoming(zoneName) {
  const zone = schedule[zoneName];
  return Object.entries(FRACTIONS)
    .map(([key, f]) => {
      const next = zone[key]?.find((d) => new Date(d) >= TODAY);
      return next
        ? { ...f, date: next, days: daysUntil(next) }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.days - b.days);
}

export default function App() {
  const [zone, setZone] = useState("Rejon I");
  const [search, setSearch] = useState("");

  const upcoming = useMemo(() => getUpcoming(zone), [zone]);

  const detectedZone = useMemo(() => {
    if (!search) return null;
    return Object.entries(schedule).find(([_, z]) =>
      z.streets.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    )?.[0];
  }, [search]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Karpacz Waste</h1>
          <p className="text-gray-400">Sprawdź kiedy wywożą Twoje śmieci</p>
        </div>

        <Card className="bg-zinc-900 border-none">
          <CardContent className="p-4 space-y-4">

            <div className="flex gap-2 items-center">
              <Search />
              <Input
                placeholder="Wpisz ulicę..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black border-zinc-700"
              />
            </div>

            {detectedZone && (
              <Badge className="bg-green-600">
                Twój rejon: {detectedZone}
              </Badge>
            )}

            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="bg-black border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(schedule).map((z) => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </Select>

          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {upcoming.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className="bg-zinc-900 border-none">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <Icon />
                    <Badge>{item.days === 0 ? "Dzisiaj" : `${item.days} dni`}</Badge>
                  </div>
                  <h2 className="text-lg mt-3">{item.label}</h2>
                  <p className="text-sm text-gray-400">{formatDate(item.date)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Button className="bg-red-600">Powiadom mnie dzień wcześniej</Button>
        </div>

      </div>
    </div>
  );
}
