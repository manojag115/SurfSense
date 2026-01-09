import { ActionBarPrimitive, MessagePrimitive, useAssistantState } from "@assistant-ui/react";
import { useAtomValue } from "jotai";
import { FileText, PencilIcon } from "lucide-react";
import type { FC } from "react";
import { messageDocumentsMapAtom } from "@/atoms/chat/mentioned-documents.atom";
import { UserMessageAttachments } from "@/components/assistant-ui/attachment";
import { BranchPicker } from "@/components/assistant-ui/branch-picker";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserMessage: FC = () => {
	const messageId = useAssistantState(({ message }) => message?.id);
	const messageDocumentsMap = useAtomValue(messageDocumentsMapAtom);
	const mentionedDocs = messageId ? messageDocumentsMap[messageId] : undefined;
	const hasAttachments = useAssistantState(
		({ message }) => message?.attachments && message.attachments.length > 0
	);

	return (
		<MessagePrimitive.Root
			className="aui-user-message-root fade-in slide-in-from-bottom-1 mx-auto grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2"
			data-role="user"
		>
			{/* User info column */}
			<UserInfo />

			<div className="aui-user-message-content-wrapper col-start-2 min-w-0">
				{/* Display attachments and mentioned documents */}
				{(hasAttachments || (mentionedDocs && mentionedDocs.length > 0)) && (
					<div className="flex flex-wrap items-end gap-2 mb-2 justify-end">
						{/* Attachments (images show as thumbnails, documents as chips) */}
						<UserMessageAttachments />
						{/* Mentioned documents as chips */}
						{mentionedDocs?.map((doc) => (
							<span
								key={doc.id}
								className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary border border-primary/20"
								title={doc.title}
							>
								<FileText className="size-3" />
								<span className="max-w-[150px] truncate">{doc.title}</span>
							</span>
						))}
					</div>
				)}
				{/* Message bubble with action bar positioned relative to it */}
				<div className="relative">
					<div className="aui-user-message-content wrap-break-word rounded-2xl bg-muted px-4 py-2.5 text-foreground">
						<MessagePrimitive.Parts />
					</div>
					<div className="aui-user-action-bar-wrapper absolute top-1/2 right-full -translate-y-1/2 pr-1">
						<UserActionBar />
					</div>
				</div>
			</div>

			<BranchPicker className="aui-user-branch-picker -mr-1 col-span-full col-start-1 row-start-3 justify-end" />
		</MessagePrimitive.Root>
	);
};

const UserInfo: FC = () => {
	// Access metadata from the message (stored during persistence)
	const messageData = useAssistantState(({ message }) => message?.metadata);

	// Extract user info from metadata (if available)
	const userInfo = messageData?.user as
		| {
				id: string;
				email: string;
				name?: string;
				avatar_url?: string | null;
		  }
		| undefined;

	if (!userInfo) {
		return <div className="col-start-1 row-start-1" />; // Spacer
	}

	// Generate display name and avatar URL
	const displayName = userInfo.name || userInfo.email.split("@")[0];
	const avatarUrl =
		userInfo.avatar_url ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

	return (
		<div className="col-start-1 row-start-1 flex items-start justify-end pr-3 pt-0.5">
			<div className="flex flex-col items-end gap-1">
				<Avatar className="size-8">
					<AvatarImage src={avatarUrl} alt={displayName} />
					<AvatarFallback className="text-xs">
						{displayName.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<span className="text-xs text-muted-foreground truncate max-w-[60px]" title={displayName}>
					{displayName}
				</span>
			</div>
		</div>
	);
};

const UserActionBar: FC = () => {
	return (
		<ActionBarPrimitive.Root
			hideWhenRunning
			autohide="not-last"
			className="aui-user-action-bar-root flex flex-col items-end"
		>
			<ActionBarPrimitive.Edit asChild>
				<TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
					<PencilIcon />
				</TooltipIconButton>
			</ActionBarPrimitive.Edit>
		</ActionBarPrimitive.Root>
	);
};
