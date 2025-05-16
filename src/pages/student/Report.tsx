
import React, { useState } from "react";
import { StudentLayout } from "@/components/layout/student-layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";
import { addReport } from "@/lib/data";

const StudentReportPage = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Add report to local storage
    if (user) {
      addReport({
        senderName: user.name,
        senderId: user.id,
        senderRole: "student",
        message: message.trim(),
      });
    }
    
    setTimeout(() => {
      toast({
        title: "Keluhan terkirim!",
        description: "Terima kasih, laporan Anda telah dikirim ke admin.",
      });
      setMessage("");
      setLoading(false);
    }, 1200);
  };

  return (
    <StudentLayout>
      <div className="max-w-xl mx-auto mt-8 bg-white shadow rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-7 w-7 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Report Keluhan/Masukan</h2>
        </div>
        <p className="text-gray-500 mb-2">
          Sampaikan keluhan atau masukan Anda untuk membantu admin mengembangkan aplikasi ini.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full rounded-2xl border border-gray-300 focus:ring-2 focus:ring-green-400 p-4 text-gray-800 resize-none min-h-[100px] mb-4 outline-none"
            placeholder="Tulis keluhan atau masukan Anda di sini..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={400}
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button
              className="rounded-full bg-gradient-to-br from-green-500 to-blue-400 px-6 py-2 font-bold text-white shadow hover:from-green-600 hover:to-blue-500 transition"
              type="submit"
              disabled={loading || message.trim().length === 0}
            >
              {loading ? "Mengirim..." : "Kirim Report"}
            </Button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
};

export default StudentReportPage;
