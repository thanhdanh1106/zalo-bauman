import React, { useEffect, useState } from 'react';
import { Modal, Box, Button } from 'zmp-ui';
import { findActivePopup } from '@shared/utils/Popups';
import { useNavigate } from 'react-router-dom';
import { openWebview } from 'zmp-sdk/apis';

const PopupManager = () => {
    const [popup, setPopup] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopup = async () => {
            const response = await findActivePopup();
            if (response && !response.error && response.data) {
                setPopup(response.data);
                // Đợi một chút sau khi app load xong mới hiện popup cho đẹp
                setTimeout(() => {
                    setVisible(true);
                }, 1500);
            }
        };

        fetchPopup();
    }, []);

    if (!popup) return null;

    return (
        <Modal
            visible={visible}
            onClose={() => setVisible(false)}
            maskClosable={true}
            className="zalo-popup-modal "
        >

            {popup.image && (
                <div className="relative w-full bg-transparent">
                    <img
                        src={popup.image}
                        alt={popup.title || 'Promotion'}
                        className="w-full h-auto block rounded-2xl cursor-pointer shadow-2xl"
                        onClick={() => {
                            if (popup.link) {
                                // Link bên ngoài (http/https)
                                if (popup.link.startsWith('http')) {
                                    try {
                                        openWebview({
                                            url: popup.link,
                                            config: { style: "normal", leftButton: "back" },
                                        });
                                    } catch (err) {
                                        // Fallback khi không ở trong Zalo
                                        window.open(popup.link, '_blank');
                                    }
                                }
                                // Link nội bộ
                                else {
                                    navigate(popup.link);
                                }
                                setVisible(false);
                            }
                        }}
                    />
                </div>
            )}

            {/* Nút đóng nhanh ở góc - Vòng tròn trắng to dễ bấm */}
            <button
                onClick={() => setVisible(false)}
                className="absolute top-6 right-2 w-8 h-8 flex items-center justify-center bg-white text-gray-900 rounded-full  active:scale-90 transition-transform z-20 border border-gray-100"
            >
                <span className="material-symbols-outlined text-xl ">close</span>
            </button>

        </Modal>
    );
};

export default PopupManager;
