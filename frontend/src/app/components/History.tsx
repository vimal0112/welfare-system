import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import jsPDF from "jspdf";

const API_BASE = "http://localhost:8080";

type HistoryItem = {
  id: number;
  age: number;
  gender: string;
  category: string;
  state: string;
  occupation: string;
  annual_income: number;
  disability: string;
  is_minority: string;
  eligibility_score: number;
  eligibility_status: string;
  checked_at: string | null; // normalized field
};

export function History() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [open, setOpen] = useState(false);

  /* ================= FETCH HISTORY ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id ?? user?.userId;

    if (!userId) return;

    fetch(`${API_BASE}/api/welfare/history?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            ...item,
            checked_at: item.checkedAt ?? item.checked_at ?? null,
          }));
          setHistoryData(mapped);
        }
      })
      .catch((err) => console.error("Failed to load history", err));
  }, []);

  /* ================= HELPERS ================= */
  const formatDateTime = (value: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "--";
    return date.toLocaleString();
  };

  const mapStatus = (status: string) => {
    if (status === "ELIGIBLE") return "Eligible";
    if (status === "NOT_ELIGIBLE") return "Not Eligible";
    return "Under Review";
  };

  /* ================= PDF DOWNLOAD ================= */
  const downloadPdfReport = (item: HistoryItem) => {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(16);
    doc.text("Eligibility Evaluation Report", 14, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Checked On: ${formatDateTime(item.checked_at)}`, 14, y);

    y += 8;
    doc.line(14, y, 196, y);

    y += 8;
    doc.setFontSize(13);
    doc.text("Input Details", 14, y);

    y += 8;
    doc.setFontSize(11);
    doc.text(`Age: ${item.age}`, 14, y); y += 6;
    doc.text(`Gender: ${item.gender}`, 14, y); y += 6;
    doc.text(`Annual Income: ₹${item.annual_income}`, 14, y); y += 6;
    doc.text(`Category: ${item.category}`, 14, y); y += 6;
    doc.text(`State: ${item.state}`, 14, y); y += 6;
    doc.text(`Occupation: ${item.occupation}`, 14, y); y += 6;
    doc.text(`Disability: ${item.disability}`, 14, y); y += 6;
    doc.text(`Minority: ${item.is_minority}`, 14, y);

    y += 8;
    doc.line(14, y, 196, y);

    y += 8;
    doc.setFontSize(13);
    doc.text("Result", 14, y);

    y += 8;
    doc.setFontSize(11);
    doc.text(`Eligibility Status: ${item.eligibility_status}`, 14, y);
    y += 6;
    doc.text(`Eligibility Score: ${item.eligibility_score}`, 14, y);

    doc.save("eligibility_report.pdf");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl mb-2">Eligibility History</h1>
        <p className="text-muted-foreground">
          View all your past eligibility checks
        </p>
      </div>

      <div className="space-y-4">
        {historyData.map((item) => (
          <Card
            key={item.id}
            className="p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1">
                      Eligibility Check ({item.category.toUpperCase()})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Checked on: {formatDateTime(item.checked_at)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-11">
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="text-sm">{item.occupation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Income</p>
                    <p className="text-sm">₹{item.annual_income}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {item.eligibility_status === "ELIGIBLE" && (
                  <Badge className="bg-accent text-accent-foreground">
                    Eligible
                  </Badge>
                )}
                {item.eligibility_status === "NOT_ELIGIBLE" && (
                  <Badge variant="destructive">Not Eligible</Badge>
                )}
                {item.eligibility_status !== "ELIGIBLE" &&
                  item.eligibility_status !== "NOT_ELIGIBLE" && (
                    <Badge className="bg-[#FFA726] text-white">
                      Under Review
                    </Badge>
                  )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(item);
                      setOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadPdfReport(item)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* VIEW MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Eligibility Check Details</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-2 text-sm">
              <p><b>Status:</b> {mapStatus(selectedItem.eligibility_status)}</p>
              <p><b>Checked On:</b> {formatDateTime(selectedItem.checked_at)}</p>

              <hr />

              <p><b>Age:</b> {selectedItem.age}</p>
              <p><b>Gender:</b> {selectedItem.gender}</p>
              <p><b>Annual Income:</b> ₹{selectedItem.annual_income}</p>
              <p><b>Category:</b> {selectedItem.category}</p>
              <p><b>State:</b> {selectedItem.state}</p>
              <p><b>Occupation:</b> {selectedItem.occupation}</p>
              <p><b>Disability:</b> {selectedItem.disability}</p>
              <p><b>Minority:</b> {selectedItem.is_minority}</p>

              <hr />

              <p><b>Eligibility Score:</b> {selectedItem.eligibility_score}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
