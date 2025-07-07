// Firestore Helper Functions
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD operations for Firestore
export class FirestoreService {
  
  // Get a single document by ID
  static async getDocument(collectionName: string, docId: string): Promise<DocumentData | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get multiple documents with optional filters
  static async getDocuments(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<DocumentData[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Create a new document
  static async createDocument(collectionName: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Update an existing document
  static async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  static async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Real-time listener for documents
  static subscribeToDocuments(
    collectionName: string,
    callback: (documents: DocumentData[]) => void,
    constraints: QueryConstraint[] = []
  ) {
    const q = query(collection(db, collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(documents);
    });
  }

  // Subscribe to a single document
  static subscribeToDocument(
    collectionName: string,
    docId: string,
    callback: (document: DocumentData | null) => void
  ) {
    const docRef = doc(db, collectionName, docId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  }
}

// Specific service classes for different entities
export class BlogService extends FirestoreService {
  private static collection = 'blogPosts';

  static async getPublishedPosts(limitCount: number = 10) {
    return this.getDocuments(this.collection, [
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ]);
  }

  static async getPostBySlug(slug: string) {
    const posts = await this.getDocuments(this.collection, [
      where('slug', '==', slug),
      limit(1)
    ]);
    return posts[0] || null;
  }

  static async createPost(postData: any) {
    return this.createDocument(this.collection, postData);
  }

  static async updatePost(postId: string, postData: any) {
    return this.updateDocument(this.collection, postId, postData);
  }

  static async deletePost(postId: string) {
    return this.deleteDocument(this.collection, postId);
  }
}

export class BusinessService extends FirestoreService {
  private static collection = 'businesses';

  static async getActiveBusinesses() {
    return this.getDocuments(this.collection, [
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getBusinessesByCategory(category: string) {
    return this.getDocuments(this.collection, [
      where('category', '==', category),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async createBusiness(businessData: any) {
    return this.createDocument(this.collection, businessData);
  }

  static async updateBusiness(businessId: string, businessData: any) {
    return this.updateDocument(this.collection, businessId, businessData);
  }
}

export class UserService extends FirestoreService {
  private static collection = 'users';

  static async createUserProfile(userId: string, userData: any) {
    const docRef = doc(db, this.collection, userId);
    await updateDoc(docRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  static async getUserProfile(userId: string) {
    return this.getDocument(this.collection, userId);
  }

  static async updateUserProfile(userId: string, userData: any) {
    return this.updateDocument(this.collection, userId, userData);
  }
}