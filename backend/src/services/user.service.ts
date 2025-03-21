import { db } from '../config/firebase';
import { User, UserDTO } from '../models/user.model';

export class UserService {
  private collection = db.collection('users');

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const userData = doc.data() as any;

    return {
      id: doc.id,
      ...userData,
      createdAt: userData.createdAt instanceof Date ? userData.createdAt : userData.createdAt.toDate()
    };
  }

  async create(userDTO: UserDTO): Promise<User> {
    const user: Omit<User, 'id'> = {
      email: userDTO.email,
      createdAt: new Date()
    };

    const docRef = await this.collection.add(user);
    const doc = await docRef.get();
    
    return {
      id: doc.id,
      ...user
    };
  }
} 