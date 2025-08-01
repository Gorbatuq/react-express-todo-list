import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/authService";


export const getMe = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password, res);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, res);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = authService.logoutUser(res);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
