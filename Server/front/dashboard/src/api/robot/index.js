import axios from 'axios';
const API_URL = 'http://localhost:3001';
const ROBOT_PATH = '/robot';
const DATA_PATH = '/data';

export const fetchList = async () => (axios.get(`${API_URL}${ROBOT_PATH}/list`));

export const fetchDataList = async () => (axios.get(`${API_URL}${DATA_PATH}/`));

export const askCommand = async (jupiterID, socketID) => (axios.post(`${API_URL}${ROBOT_PATH}/command`, {
    jupiterID,
    socketID,
}));

export const uploadFirmware = async (formData) => axios.post(`${API_URL}${ROBOT_PATH}/firmware`, formData);

export const flashOTAFirmware = async (socketId, fileName) => axios.post(`${API_URL}${ROBOT_PATH}/flash`, { socketId, fileName });
