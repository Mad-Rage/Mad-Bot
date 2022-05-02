/// <reference types="node" />
import { EventEmitter } from 'events';
import type { Client, Snowflake, Guild, GuildMember, Invite, User } from 'discord.js';
import { Collection } from 'discord.js';
declare type JoinType = 'permissions' | 'normal' | 'vanity' | 'unknown';
declare interface InvitesTracker {
    on(event: 'cacheFetched', listener: () => void): this;
    on(event: 'guildMemberAdd', listener: (member: GuildMember, joinType: JoinType, usedInvite: InviteData | null) => void): this;
}
interface ExemptGuildFunction {
    (guild: Guild): boolean;
}
interface InvitesTrackerOptions {
    fetchGuilds: boolean;
    fetchAuditLogs: boolean;
    fetchVanity: boolean;
    exemptGuild?: ExemptGuildFunction;
    activeGuilds?: Snowflake[];
}
interface InviteData {
    guildId: Snowflake;
    code: string;
    url: string;
    uses: number | null;
    maxUses: number | null;
    maxAge: number | null;
    createdTimestamp: number | null;
    inviter: User | null;
}
interface VanityInviteData {
    code: string | null;
    uses: number | null;
}
interface DeletedInviteData extends InviteData {
    deleted?: boolean;
    deletedTimestamp?: number;
}
declare type TrackedInviteData = DeletedInviteData & InviteData;
declare class InvitesTracker extends EventEmitter {
    client: Client;
    options: Partial<InvitesTrackerOptions>;
    invitesCache: Collection<Snowflake, Collection<string, TrackedInviteData>>;
    vanityInvitesCache: Collection<Snowflake, VanityInviteData>;
    invitesCacheUpdates: Collection<Snowflake, number>;
    cacheFetched: boolean;
    constructor(client: Client, options: InvitesTrackerOptions);
    get guilds(): Collection<Snowflake, Guild>;
    static mapInviteData(invite: Invite): TrackedInviteData;
    private handleInviteCreate;
    private handleInviteDelete;
    /**
     * Emit quand un membre rejoint un serveur.
     * @param member Le membre qui a rejoint.
     */
    private handleGuildMemberAdd;
    private fetchGuildCache;
    fetchCache(): Promise<void>;
}
declare const _default: {
    init: (client: Client<boolean>, options: InvitesTrackerOptions) => InvitesTracker;
};
export = _default;
