import React, { createContext, useContext } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext();

export const useNotificationContext = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const getNotificationClass = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-l-4 border-green-500';
            case 'error':
                return 'bg-red-100 text-red-800 border-l-4 border-red-500';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
            case 'info':
            default:
                return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
        }
    };

    const openNotification = (type = 'info', message = 'Hello', description = 'Hello', pauseOnHover = false) => {
        const notificationProps = {
            message,
            description,
            duration: 3,
            pauseOnHover,
            placement: 'bottomRight',
            className: getNotificationClass(type),
        };

        switch (type) {
            case 'success':
                api.success(notificationProps);
                break;
            case 'error':
                api.error(notificationProps);
                break;
            case 'warning':
                api.warning(notificationProps);
                break;
            case 'info':
            default:
                api.info(notificationProps);
                break;
        }

    };

    return (
        <NotificationContext.Provider value={{ openNotification }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};
