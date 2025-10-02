import VocabularyCard from "@/components/VocabularyCard";
import ccatWords from "@/data/vocabulary";

export default function ListenPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <VocabularyCard words={ccatWords} />
      </div>
    </div>
  );
}
