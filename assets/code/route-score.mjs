function scoreTemplate(template, preferences) {
  let score = 0;
  const interests = preferences.interests.join(" ");

  // 先按路线时长与游客预算的接近程度计算基础分
  const over = template.durationMinutes - preferences.durationMinutes;
  if (over <= 0) {
    score += 70 + Math.max(0, 30 + over / 4);
  } else {
    score += Math.max(0, 50 - over / 3);
  }

  // 通用路线承担纯时长请求，主题路线由明确兴趣触发
  const generalRoutes = new Set([
    "quick_30", "one_hour_core", "classic_150", "culture_half_day"
  ]);
  if (generalRoutes.has(template.id)) score += 25;
  if (/历史|文化|深度/.test(interests)
      && template.tags.includes("history")) score += 45;
  if (/佛教|祈福|朝圣/.test(interests)
      && template.tags.includes("buddhist")) score += 45;
  if (/自然|风光|太湖/.test(interests)
      && template.tags.includes("nature")) score += 35;
  if (preferences.photoFocus
      && template.tags.includes("photo")) score += 45;
  if (preferences.withChildren
      && template.tags.includes("family")) score += 60;
  if (preferences.wantsShow
      && template.tags.includes("show")) score += 40;

  // 低体力游客优先平缓路线并降低登高节点权重
  if (preferences.avoidStairs
      && template.tags.includes("easy")) score += 30;
  if (preferences.avoidStairs
      && template.nodeIds.includes("buddha")) score -= 20;
  return score;
}
