import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type RiskEntry = {
    id: string; // temp id for UI
    risk_id: string;
    asset_name: string;
    threat_description: string;
    vulnerability_description: string;
    likelihood_score: number;
    impact_score: number;
    existing_controls: string;
    recommended_controls: string;
    status: string;
};

const getRiskLevel = (score: number) => {
    if (score <= 4) return { label: "Low", color: "bg-green-100 text-green-800 border-green-200" };
    if (score <= 9) return { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    if (score <= 16) return { label: "High", color: "bg-orange-100 text-orange-800 border-orange-200" };
    return { label: "Critical", color: "bg-red-100 text-red-800 border-red-200" };
};

export const RiskRegisterBuilder = ({
    entries,
    onChange
}: {
    entries: RiskEntry[],
    onChange: (e: RiskEntry[]) => void
}) => {

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<RiskEntry>>({});

    const handleAdd = () => {
        const newId = `temp-${Date.now()}`;
        const newEntry: RiskEntry = {
            id: newId,
            risk_id: `RSK-${entries.length + 1}`,
            asset_name: "",
            threat_description: "",
            vulnerability_description: "",
            likelihood_score: 1,
            impact_score: 1,
            existing_controls: "",
            recommended_controls: "",
            status: "identified"
        };
        onChange([...entries, newEntry]);
        setIsEditing(newId);
        setEditForm(newEntry);
    };

    const handleSave = () => {
        if (!isEditing) return;
        onChange(entries.map(e => e.id === isEditing ? { ...e, ...editForm } as RiskEntry : e));
        setIsEditing(null);
    };

    const handleDelete = (id: string) => {
        onChange(entries.filter(e => e.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Risk Register</h3>
                <Button onClick={handleAdd} size="sm"><Plus className="mr-2 h-4 w-4" /> Add Risk</Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm data-table">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 text-left font-medium">Risk ID</th>
                            <th className="p-3 text-left font-medium">Asset</th>
                            <th className="p-3 text-left font-medium">Threat / Vuln</th>
                            <th className="p-3 text-left font-medium">Score</th>
                            <th className="p-3 text-left font-medium">Level</th>
                            <th className="p-3 text-left font-medium">Status</th>
                            <th className="p-3 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                                    No risks identified yet. Click "Add Risk" to begin.
                                </td>
                            </tr>
                        ) : entries.map(entry => {

                            if (isEditing === entry.id) {
                                return (
                                    <tr key={entry.id} className="bg-secondary/20">
                                        <td colSpan={7} className="p-4">
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label>Risk ID</Label>
                                                    <Input value={editForm.risk_id || ""} onChange={e => setEditForm({ ...editForm, risk_id: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Asset Name</Label>
                                                    <Input value={editForm.asset_name || ""} onChange={e => setEditForm({ ...editForm, asset_name: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Status</Label>
                                                    <Select value={editForm.status} onValueChange={v => setEditForm({ ...editForm, status: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="identified">Identified</SelectItem>
                                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                                            <SelectItem value="mitigated">Mitigated</SelectItem>
                                                            <SelectItem value="accepted">Accepted</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2 lg:col-span-3">
                                                    <Label>Threat Description</Label>
                                                    <Textarea value={editForm.threat_description || ""} onChange={e => setEditForm({ ...editForm, threat_description: e.target.value })} rows={2} />
                                                </div>
                                                <div className="space-y-2 lg:col-span-3">
                                                    <Label>Vulnerability Description</Label>
                                                    <Textarea value={editForm.vulnerability_description || ""} onChange={e => setEditForm({ ...editForm, vulnerability_description: e.target.value })} rows={2} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Likelihood Score (1-5)</Label>
                                                    <Input type="number" min={1} max={5} value={editForm.likelihood_score || 1} onChange={e => setEditForm({ ...editForm, likelihood_score: Number(e.target.value) })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Impact Score (1-5)</Label>
                                                    <Input type="number" min={1} max={5} value={editForm.impact_score || 1} onChange={e => setEditForm({ ...editForm, impact_score: Number(e.target.value) })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Calculated Risk Score</Label>
                                                    <div className="py-2 font-medium text-lg">
                                                        {(editForm.likelihood_score || 1) * (editForm.impact_score || 1)}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 lg:col-span-3 flex justify-end gap-2 pt-2 border-t mt-2">
                                                    <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
                                                    <Button onClick={handleSave}>Save Risk</Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            const score = entry.likelihood_score * entry.impact_score;
                            const level = getRiskLevel(score);

                            return (
                                <tr key={entry.id} className="hover:bg-muted/50">
                                    <td className="p-3 font-medium">{entry.risk_id}</td>
                                    <td className="p-3">{entry.asset_name || "-"}</td>
                                    <td className="p-3">
                                        <div className="max-w-[300px] truncate text-xs" title={entry.threat_description}>
                                            <span className="font-semibold">T:</span> {entry.threat_description || "-"}
                                        </div>
                                        <div className="max-w-[300px] truncate text-xs text-muted-foreground" title={entry.vulnerability_description}>
                                            <span className="font-semibold text-foreground">V:</span> {entry.vulnerability_description || "-"}
                                        </div>
                                    </td>
                                    <td className="p-3 font-mono text-center">{score} ({entry.likelihood_score}x{entry.impact_score})</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${level.color}`}>
                                            {level.label}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Badge variant="outline" className="capitalize">{entry.status.replace("_", " ")}</Badge>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setIsEditing(entry.id); setEditForm(entry); }}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(entry.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
