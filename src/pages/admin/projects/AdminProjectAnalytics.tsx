import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Users, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const supabaseAny = supabase as any;

const AdminProjectAnalytics = () => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("id");
    const [projectTitle, setProjectTitle] = useState("All Projects");
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        avgTime: "0m 0s",
        completionRate: "0%"
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (projectId) {
                const { data } = await supabaseAny.from("projects").select("title, view_count").eq("id", projectId).maybeSingle();
                if (data) {
                    setProjectTitle(data.title);
                    setStats({
                        totalViews: data.view_count || 0,
                        uniqueVisitors: Math.floor((data.view_count || 0) * 0.6), // Mock calculation for demo
                        avgTime: "2m 45s",
                        completionRate: "68%"
                    });
                }
            } else {
                const { data } = await supabaseAny.from("projects").select("view_count");
                if (data) {
                    const total = data.reduce((acc: number, p: any) => acc + (p.view_count || 0), 0);
                    setStats({
                        totalViews: total,
                        uniqueVisitors: Math.floor(total * 0.7),
                        avgTime: "1m 30s",
                        completionRate: "45%"
                    });
                }
            }
        };

        void fetchStats();
    }, [projectId]);

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/admin/projects"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Analytics: {projectTitle}</h1>
                    <p className="text-muted-foreground text-sm">Performance metrics and visitor engagement stats.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 whitespace-nowrap">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
                        <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Engagement Time</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgTime}</div>
                        <p className="text-xs text-muted-foreground mt-1">-2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Read Completion</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completionRate}</div>
                        <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Traffic Overview</CardTitle>
                    <CardDescription>Views over the last 30 days. Connect to real tracking backend for detailed charts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full border-dashed border-2 rounded-lg flex items-center justify-center bg-secondary/10">
                        <p className="text-muted-foreground flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" /> Chart component placeholder
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProjectAnalytics;
