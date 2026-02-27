"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";

/* ---------------- TYPES ---------------- */

type Outfit = {
  id: number;
  gender: "male" | "female";
  occasion: string[];
  mood: string[];
  budget: string[];
  title?: string;
  image: string;
  affiliateLink?: string;
};

export default function OutfitChat() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [occasion, setOccasion] = useState("");
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<Outfit[]>([]);
  const [typing, setTyping] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [allOutfits, setAllOutfits] = useState<Outfit[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const moods = ["Chill", "Classic", "Bold", "Traditional"];
  const occasions = ["College", "Party", "Date", "Wedding", "Holi"];
  const budgets = ["Low", "Medium", "High"];

  /* ---------------- LOAD JSON FROM PUBLIC ---------------- */

  useEffect(() => {
    async function loadOutfits() {
      const res = await fetch("/outfits/rawOutfits.json");
      const data = await res.json();
      setAllOutfits(data);
    }

    loadOutfits();
  }, []);

  /* ---------------- LOAD SAVED ---------------- */

  useEffect(() => {
    if (!user) return;

    const loadSaved = async () => {
      const { data } = await supabase
        .from("ai_outfit_images")
        .select("ai_suggestion")
        .eq("user_id", user.id);

      if (data) {
        const savedIds = data
          .map((row: any) => {
            const match = row.ai_suggestion?.match(/\[ID:(\d+)\]/);
            return match ? parseInt(match[1]) : null;
          })
          .filter((id: number | null): id is number => id !== null);

        setSaved(savedIds);
      }
    };

    loadSaved();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, results, typing]);

  function simulateTyping(nextStep: number) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(nextStep);
    }, 500);
  }

  /* ---------------- RANKING LOGIC ---------------- */

  function generateLooks() {
    if (!gender) return;

    const genderFiltered = allOutfits.filter(
      (item) => item.gender === gender
    );

    const scored = genderFiltered.map((item) => {
      let score = 0;

      if (item.occasion.includes(occasion.toLowerCase()))
        score += 3;

      if (item.mood.includes(mood.toLowerCase()))
        score += 2;

      if (item.budget.includes(budget.toLowerCase()))
        score += 1;

      return { ...item, score };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);

let topTwo: Outfit[] = [];

if (sorted.length > 0) {
  topTwo = sorted.slice(0, 2);
} else {
  const shuffled = [...genderFiltered].sort(() => 0.5 - Math.random());
  topTwo = shuffled.slice(0, 2);
}

    setResults(topTwo);
    simulateTyping(5);
  }

  /* ---------------- SURPRISE ---------------- */

  function surpriseMe() {
    if (!gender) return;

    const genderFiltered = allOutfits.filter(
      (item) => item.gender === gender
    );

    const shuffled = [...genderFiltered].sort(() => 0.5 - Math.random());
    setResults(shuffled.slice(0, 2));
  }

  function restyle() {
    setGender("");
    setMood("");
    setOccasion("");
    setBudget("");
    setResults([]);
    setStep(1);
  }

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-black flex justify-center py-12">
      <div className="w-full max-w-xl px-4">
        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4">

          <h1 className="text-2xl font-bold">
            Outfevibe
          </h1>

          {step >= 1 && (
            <>
              <p>Who are we styling today?</p>
              {!gender && (
                <div className="flex gap-2">
                  <button onClick={() => { setGender("female"); simulateTyping(2); }}>Girl</button>
                  <button onClick={() => { setGender("male"); simulateTyping(2); }}>Boy</button>
                </div>
              )}
            </>
          )}

          {step >= 2 && (
            <>
              <p>Where are we going?</p>
              {!occasion && (
                <div className="flex gap-2 flex-wrap">
                  {occasions.map((o) => (
                    <button key={o} onClick={() => { setOccasion(o); simulateTyping(3); }}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step >= 3 && (
            <>
              <p>What’s the vibe?</p>
              {!mood && (
                <div className="flex gap-2 flex-wrap">
                  {moods.map((m) => (
                    <button key={m} onClick={() => { setMood(m); simulateTyping(4); }}>
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step >= 4 && (
            <>
              <p>What’s your budget?</p>
              {!budget && (
                <div className="flex gap-2 flex-wrap">
                  {budgets.map((b) => (
                    <button key={b} onClick={() => { setBudget(b); generateLooks(); }}>
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <p>Your looks ✨</p>

              {results.map((look) => (
                <div key={look.id}>
                  <img src={look.image} alt={look.title} width="100%" />
                  <p>{look.title}</p>
                </div>
              ))}

              <button onClick={restyle}>Restyle</button>
              <button onClick={surpriseMe}>Surprise Me</button>
            </>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>
    </main>
  );
}