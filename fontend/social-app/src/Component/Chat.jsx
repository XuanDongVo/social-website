import React, { useState, useEffect } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllChats, createChat as createChatApi } from '../Api/Chat/Chat';
import { getAllUsersExceptSelf } from '../Api/User/User';
import ChatArea from './ChatArea';

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [displayMode, setDisplayMode] = useState('chats'); // 'chats' hoặc 'users'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    // Lấy danh sách chats
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await getAllChats(localStorage.getItem('id'));
                const groupedChats = groupChats(response.data || []);
                console.log(groupedChats);
                setChats(groupedChats);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
        fetchChats();
    }, []);

    // Lấy danh sách users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersExceptSelf(localStorage.getItem('id'));
                setUsers(response.data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Tạo chat mới
    const createChat = async (receiverId) => {
        try {
            const senderId = localStorage.getItem('id');
            const response = await createChatApi(senderId, receiverId);

            setSelectedChat({
                chatId: response.data.response,
            });
            setDisplayMode('chats'); // Chuyển về chế độ hiển thị chats
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };

    const groupChats = (chats) => {
        const grouped = [];

        chats.forEach(chat => {
            // Tìm kiếm nhóm đã tồn tại với cùng người gửi và người nhận, bất kể thứ tự
            const existingChat = grouped.find(existing =>
                (existing.senderId === chat.senderId && existing.receiverId === chat.receiverId) ||
                (existing.senderId === chat.receiverId && existing.receiverId === chat.senderId)
            );

            if (!existingChat) {
                // Nếu chưa có nhóm, tạo nhóm mới
                grouped.push({
                    id: chat.id,
                    name: chat.name,
                    senderId: chat.senderId,
                    receiverId: chat.receiverId,
                    unReadCount: chat.unReadCount,
                    lastMessage: chat.lastMessage,
                    lastMessageTime: chat.lastMessageTime,
                    recipientOnline: chat.recipientOnline,
                });
            } else {
                // Cập nhật thông tin nếu tin nhắn mới hơn
                if (new Date(existingChat.lastMessageTime) < new Date(chat.lastMessageTime)) {
                    existingChat.lastMessage = chat.lastMessage;
                    existingChat.lastMessageTime = chat.lastMessageTime;
                }

                // Cập nhật số lượng tin nhắn chưa đọc nếu cùng người gửi
                if (chat.senderId !== localStorage.getItem('id')) {
                    existingChat.unReadCount += chat.unReadCount;
                }

                // Cập nhật id của nhóm nếu người dùng là người gửi
                if (chat.senderId === localStorage.getItem('id')) {
                    existingChat.id = chat.id;
                }

                // Cập nhật trạng thái online của người nhận
                existingChat.recipientOnline = chat.recipientOnline;
            }
        });

        return grouped;
    };



    // // Lọc dữ liệu dựa trên searchTerm
    // useEffect(() => {
    //     const dataToFilter = displayMode === 'chats' ? chats : users;
    //     const filtered = dataToFilter.filter((item) =>
    //         `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    //     setFilteredData(filtered);
    // }, [searchTerm, displayMode, chats, users]);

    return (
        <div className='d-flex' style={{ height: '100vh' }}>
            {/* Sidebar */}
            <div className="bg-light" style={{ width: '250px', height: '100vh', overflowY: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center gap-2 p-2">
                    <h4>Chat</h4>
                    <div className="d-flex gap-2">
                        <span className="badge rounded-pill text-bg-light cursor-pointer" onClick={() => setDisplayMode('chats')}>All</span>
                        <span className="badge rounded-pill text-bg-light cursor-pointer" onClick={() => setDisplayMode('users')}>Unread</span>
                        <span className="badge rounded-pill text-bg-light cursor-pointer">Favorites</span>
                    </div>
                </div>

                {/* Search */}
                <div className="p-2">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control-sm"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* List Display */}
                <ListGroup variant="flush">
                    {(displayMode === 'chats' ? chats : users).map((item) => {
                        // Logic for chats
                        if (displayMode === 'chats') {
                            const lastMessage = item.lastMessage || "No messages yet"; // Default message if none exists
                            const unReadCount = item.unReadCount;

                            return (
                                <ListGroup.Item key={item.id}>
                                    <div
                                        className="d-flex justify-content-between text-dark text-decoration-none"
                                        onClick={() =>
                                            setSelectedChat({
                                                chatId: item.id,
                                                receiverId: localStorage.getItem('id') === item.senderId ? item.receiverId : item.senderId,
                                                name: item.name,
                                            })
                                        }
                                    >
                                        <div>
                                            <strong>{item.name}</strong>
                                            <p className="m-0 text-muted">{lastMessage}</p>
                                        </div>
                                        {unReadCount > 0 && (
                                            <Badge bg="danger" pill>
                                                {unReadCount}
                                            </Badge>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            );
                        }

                        // Logic for users
                        return (
                            <ListGroup.Item key={item.id}>
                                <div
                                    onClick={() => createChat(item.id)}
                                    className="d-flex justify-content-between text-dark cursor-pointer"
                                >
                                    <strong>
                                        {item.firstName} {item.lastName}
                                    </strong>
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>


                {/* Chat Area */}

            </div>

            <div className="flex-grow-1">
                {selectedChat ? (
                    <ChatArea chatId={selectedChat.chatId} receiverId={selectedChat.receiverId} name={selectedChat.name} />
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <h4>Select a chat to start messaging</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;