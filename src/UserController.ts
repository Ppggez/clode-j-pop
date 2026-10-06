import { Request, Response } from 'express';
import User from './User';
import { validateUser } from './UserValidator';


export const createUser = async (req: Request, res: Response) => {
  const errors = validateUser(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const { name, email, password, age } = req.body;
    const newUser = new User({ name, email, password, age });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const errors = validateUser(updateData, true);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // resend update data
      runValidators: true, // checking schema
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error });
  }
};
