import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Crown, Star, Trophy, Gift, Zap, Target, Award, Calendar } from "lucide-react";

// Mock customer ID - in real app this would come from auth context
const CUSTOMER_ID = "customer-1";

export default function LoyaltyPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch loyalty data
  const { data: loyaltyPoints = 0 } = useQuery({
    queryKey: ["/api/loyalty/points", CUSTOMER_ID],
    queryFn: () => apiRequest("GET", `/api/loyalty/points/${CUSTOMER_ID}`).then(res => res.json().then(data => data.points))
  });

  const { data: pointsHistory = [] } = useQuery({
    queryKey: ["/api/loyalty/history", CUSTOMER_ID],
    queryFn: () => apiRequest("GET", `/api/loyalty/history/${CUSTOMER_ID}`).then(res => res.json())
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ["/api/challenges"],
    queryFn: () => apiRequest("GET", "/api/challenges?active=true").then(res => res.json())
  });

  const { data: customerChallenges = [] } = useQuery({
    queryKey: ["/api/challenges/customer", CUSTOMER_ID],
    queryFn: () => apiRequest("GET", `/api/challenges/customer/${CUSTOMER_ID}`).then(res => res.json())
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements/customer", CUSTOMER_ID],
    queryFn: () => apiRequest("GET", `/api/achievements/customer/${CUSTOMER_ID}`).then(res => res.json())
  });

  const { data: rewards = [] } = useQuery({
    queryKey: ["/api/loyalty/rewards"],
    queryFn: () => apiRequest("GET", "/api/loyalty/rewards?active=true").then(res => res.json())
  });

  const { data: redemptions = [] } = useQuery({
    queryKey: ["/api/loyalty/redemptions", CUSTOMER_ID],
    queryFn: () => apiRequest("GET", `/api/loyalty/redemptions/${CUSTOMER_ID}`).then(res => res.json())
  });

  // Mutations
  const joinChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => 
      apiRequest("POST", `/api/challenges/${challengeId}/join`, { customerId: CUSTOMER_ID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/customer", CUSTOMER_ID] });
      toast({ title: "Challenge joined successfully!", description: "Start working on your submission." });
    },
    onError: () => {
      toast({ title: "Failed to join challenge", variant: "destructive" });
    }
  });

  const redeemRewardMutation = useMutation({
    mutationFn: (rewardId: string) => 
      apiRequest("POST", `/api/loyalty/rewards/${rewardId}/redeem`, { customerId: CUSTOMER_ID }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/points", CUSTOMER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/redemptions", CUSTOMER_ID] });
      toast({ title: "Reward redeemed successfully!", description: "Check your redemptions for details." });
    },
    onError: (error: any) => {
      const message = error.message === 'Insufficient points' ? 
        "You don't have enough points for this reward" : "Failed to redeem reward";
      toast({ title: message, variant: "destructive" });
    }
  });

  // Calculate tier and progress
  const getTier = (points: number) => {
    if (points >= 10000) return { name: "Platinum", color: "bg-purple-500", icon: Crown };
    if (points >= 5000) return { name: "Gold", color: "bg-yellow-500", icon: Star };
    if (points >= 2000) return { name: "Silver", color: "bg-gray-400", icon: Trophy };
    return { name: "Bronze", color: "bg-orange-600", icon: Gift };
  };

  const getNextTierProgress = (points: number) => {
    if (points >= 10000) return { progress: 100, needed: 0, nextTier: "Platinum (Max)" };
    if (points >= 5000) return { progress: ((points - 5000) / 5000) * 100, needed: 10000 - points, nextTier: "Platinum" };
    if (points >= 2000) return { progress: ((points - 2000) / 3000) * 100, needed: 5000 - points, nextTier: "Gold" };
    return { progress: (points / 2000) * 100, needed: 2000 - points, nextTier: "Silver" };
  };

  const currentTier = getTier(loyaltyPoints);
  const tierProgress = getNextTierProgress(loyaltyPoints);
  const TierIcon = currentTier.icon;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hibla Loyalty Program</h1>
        <p className="text-muted-foreground">Earn points, complete challenges, and unlock exclusive rewards!</p>
      </div>

      {/* Loyalty Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{loyaltyPoints.toLocaleString()}</div>
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentTier.color}`}></div>
                <span className="font-semibold">{currentTier.name}</span>
              </div>
              <TierIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {customerChallenges.filter((c: any) => c.status === 'completed').length}
              </div>
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      {tierProgress.needed > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Progress to {tierProgress.nextTier}</CardTitle>
            <CardDescription>
              You need {tierProgress.needed.toLocaleString()} more points to reach {tierProgress.nextTier} tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={tierProgress.progress} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Points Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Points Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointsHistory.slice(0, 5).map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                      <div className={`font-bold ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.points > 0 ? '+' : ''}{entry.points}
                      </div>
                    </div>
                  ))}
                  {pointsHistory.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No points activity yet. Start shopping or join challenges!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Challenges Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.slice(0, 3).map((challenge: any) => (
                    <div key={challenge.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{challenge.title}</h4>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {challenge.description.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{challenge.pointsReward} points</span>
                        <Button 
                          size="sm" 
                          onClick={() => joinChallengeMutation.mutate(challenge.id)}
                          disabled={joinChallengeMutation.isPending}
                        >
                          Join Challenge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Challenges */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Available Challenges</h3>
              <div className="space-y-4">
                {challenges.map((challenge: any) => (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.category}</CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{challenge.pointsReward} points</span>
                          <span className="text-xs text-muted-foreground">
                            Ends {formatDate(challenge.endDate)}
                          </span>
                        </div>
                        <Button 
                          onClick={() => joinChallengeMutation.mutate(challenge.id)}
                          disabled={joinChallengeMutation.isPending}
                        >
                          Join Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* My Challenges */}
            <div>
              <h3 className="text-xl font-semibold mb-4">My Challenges</h3>
              <div className="space-y-4">
                {customerChallenges.map((participation: any) => (
                  <Card key={participation.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{participation.challenge.title}</CardTitle>
                        <Badge variant={participation.status === 'completed' ? 'default' : 'secondary'}>
                          {participation.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{participation.challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {participation.challenge.pointsReward} points
                        </span>
                        {participation.status === 'started' && (
                          <Button size="sm" variant="outline">
                            Submit Work
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {customerChallenges.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        You haven't joined any challenges yet. Join one to start earning points!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward: any) => (
              <Card key={reward.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{reward.pointsCost} pts</span>
                      <Badge variant="outline">{reward.tierRequirement}</Badge>
                    </div>
                    {reward.validUntil && (
                      <p className="text-xs text-muted-foreground">
                        Valid until {formatDate(reward.validUntil)}
                      </p>
                    )}
                    <Button 
                      className="w-full"
                      onClick={() => redeemRewardMutation.mutate(reward.id)}
                      disabled={loyaltyPoints < reward.pointsCost || redeemRewardMutation.isPending}
                    >
                      {loyaltyPoints < reward.pointsCost ? 'Insufficient Points' : 'Redeem'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement: any) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.achievement.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{achievement.achievement.name}</CardTitle>
                      <CardDescription>{achievement.achievement.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{achievement.achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      +{achievement.achievement.pointsReward} points
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Unlocked {formatDate(achievement.unlockedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No achievements unlocked yet. Start shopping and completing challenges to earn your first achievement!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}