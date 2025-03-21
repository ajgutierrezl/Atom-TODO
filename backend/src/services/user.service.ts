import { User, UserDTO } from '../models/user.model';
import { getFirestore } from '../config/firebase';

export class UserService {
  private collection = 'users';

  async findByEmail(email: string): Promise<User | null> {
    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collection)
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const db = getFirestore();
      const doc = await db.collection(this.collection).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(userData: UserDTO): Promise<User> {
    try {
      const db = getFirestore();
      const docRef = await db.collection(this.collection).add({
        ...userData,
        createdAt: new Date()
      });

      const newDoc = await docRef.get();
      return {
        id: newDoc.id,
        ...newDoc.data()
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
} 