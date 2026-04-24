export interface FriendshipTableResponse {
  status: number;
  response: FriendshipTables;
  callsRemaining: number;
}

export interface FriendshipTables {
  /** Natural (Permanent) relationships between planets */
  permanent_table: Record<string, PermanentFriendship>;
  
  /** Situational (Temporary) relationships based on current chart positions */
  temporary_friendship: Record<string, TemporaryFriendship>;
  
  /** The combined result of Permanent and Temporary relationships */
  five_fold_friendship: Record<string, FiveFoldFriendship>;
}

/** * Categories for Permanent relationships (includes Neutral)
 */
export interface PermanentFriendship {
  Friends: string[];
  Neutral: string[];
  Enemies: string[];
}

/** * Categories for Temporary relationships (usually binary)
 */
export interface TemporaryFriendship {
  Friends: string[];
  Enemies: string[];
}

/** * Categories for the 5-fold (Panchadha) friendship 
 */
export interface FiveFoldFriendship {
  IntimateFriend: string[];
  Friends: string[];
  Neutral: string[];
  Enemies: string[];
  BitterEnemy: string[];
}