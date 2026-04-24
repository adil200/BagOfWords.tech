'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getArticleStatsAction } from './actions';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getArticleStatsAction();
        if (result.success) {
          setStats(result.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      title: 'Published',
      value: stats.published,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Drafts',
      value: stats.drafts,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your content.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="bg-accent hover:bg-accent/90">
            Create New Article
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? '...' : stat.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/articles/new">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>New Article</span>
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Manage Articles</span>
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Media Library</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Recent activity will appear here once you start managing articles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
