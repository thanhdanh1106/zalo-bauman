import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  IconButton,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  Collapse,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { getThumbnailUrl } from '@shared/utils/Hooks';
import { useChat } from '@shared/hooks/useChat';
import { userProps } from '@shared/types/user';
import { useSelector } from 'react-redux';
import { RootState } from '@shared/store';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface ChatUser {
  userId: number;
  userName: string;
  userAvatar?: string;
  isOnline?: boolean;
  unreadCount?: number;
  userObject?: userProps;
}

interface MessageBoxProps {
  onClose?: () => void;
}

export function MessageBox({ onClose }: MessageBoxProps): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<ChatUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create mock user object for chat
  const createMockUser = (userId: number, userName: string, userAvatar?: string): userProps => ({
    id: userId,
    name: userName,
    email: `user${userId}@example.com`,
    information: {
      avatar: userAvatar ? { uuid: userAvatar } : undefined
    },
    last_seen: new Date().toISOString()
  } as userProps);
  
  // Use chat hook for selected chat
  const receiver = selectedChat?.userObject || createMockUser(0, 'Unknown');
  const { chatRoom, sendMessage } = useChat(user!, receiver);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatRoom.messages]);

  useEffect(() => {
    const handleOpenMessage = (event: CustomEvent) => {
      const { userId, userName, userAvatar } = event.detail;
      
      // Create user object for chat
      const userObject = createMockUser(userId, userName, userAvatar);
      
      // Check if chat already exists
      const existingChat = activeChats.find(chat => chat.userId === userId);
      if (!existingChat) {
        const newChat: ChatUser = {
          userId,
          userName,
          userAvatar,
          isOnline: true,
          unreadCount: 0,
          userObject
        };
        setActiveChats(prev => [...prev, newChat]);
      }
      
      setSelectedChat({ userId, userName, userAvatar, isOnline: true, userObject });
      setIsOpen(true);
      setIsMinimized(false);
      
      // Load messages for this user
      loadMessagesForUser(userId);
    };

    window.addEventListener('openMessage', handleOpenMessage as EventListener);
    return () => {
      window.removeEventListener('openMessage', handleOpenMessage as EventListener);
    };
  }, [activeChats]);

  const loadMessagesForUser = (userId: number) => {
    // Messages are now handled by useChat hook
    // The hook will automatically load messages for the selected user
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat && user) {
      try {
        await sendMessage(selectedChat.userId, {
          content: newMessage.trim(),
          car: null
        });
        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseChat = (userId: number) => {
    setActiveChats(prev => prev.filter(chat => chat.userId !== userId));
    if (selectedChat?.userId === userId) {
      setSelectedChat(null);
    }
    if (activeChats.length <= 1) {
      setIsOpen(false);
    }
  };

  const handleSelectChat = (chat: ChatUser) => {
    setSelectedChat(chat);
    setIsMinimized(false);
    loadMessagesForUser(chat.userId);
  };

  if (!isOpen) return <></>;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 20,
        zIndex: 1300,
        display: 'flex',
        gap: 1
      }}
    >
      {/* Chat List */}
      {activeChats.length > 1 && (
        <Paper
          elevation={8}
          sx={{
            width: 280,
            maxHeight: 400,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardHeader
            title={t('Active Chats')}
            sx={{ py: 1 }}
            action={
              <IconButton size="small" onClick={() => setIsOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
          <List sx={{ py: 0, maxHeight: 300, overflow: 'auto' }}>
            {activeChats.map((chat) => (
              <ListItem
                key={chat.userId}
                button
                onClick={() => handleSelectChat(chat)}
                selected={selectedChat?.userId === chat.userId}
                sx={{ py: 1 }}
              >
                <ListItemAvatar>
                  <Badge
                    color="success"
                    variant="dot"
                    invisible={!chat.isOnline}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar
                      src={chat.userAvatar ? getThumbnailUrl(chat.userAvatar) : undefined}
                      sx={{ width: 32, height: 32 }}
                    >
                      {chat.userName.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.userName}
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseChat(chat.userId);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Active Chat Window */}
      {selectedChat && (
        <Paper
          elevation={8}
          sx={{
            width: 350,
            height: isMinimized ? 'auto' : 500,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardHeader
            avatar={
              <Badge
                color="success"
                variant="dot"
                invisible={!selectedChat.isOnline}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar
                  src={selectedChat.userAvatar ? getThumbnailUrl(selectedChat.userAvatar) : undefined}
                  sx={{ width: 32, height: 32 }}
                >
                  {selectedChat.userName.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
            }
            title={selectedChat.userName}
            titleTypographyProps={{ fontSize: '0.875rem' }}
            sx={{ py: 1 }}
            action={
              <Box>
                <IconButton size="small" onClick={() => setIsMinimized(!isMinimized)}>
                  <MinimizeIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleCloseChat(selectedChat.userId)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          />
          
          <Collapse in={!isMinimized}>
            <Divider />
            
            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                maxHeight: 350,
                overflow: 'auto',
                p: 1
              }}
            >
              {chatRoom.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === user?.id ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: message.sender === user?.id ? 'primary.main' : 'grey.200',
                      color: message.sender === user?.id ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: '0.7rem'
                      }}
                    >
                      {dayjs(message.created_at).format('HH:mm')}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            
            <Divider />
            
            {/* Message Input */}
            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('Type a message...')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Collapse>
        </Paper>
      )}
    </Box>
  );
}

export default MessageBox;

