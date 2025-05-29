import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, Timestamp, addDoc, collection, doc, getDocs, orderBy, query, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, from, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
    });
  }

  /**
   * Stores basic user data in Firestore after account creation.
   * @param uid - The user's unique ID.
   * @param email - The user's email address.
   * @returns A Promise resolving when the user data is saved.
   */
  createUser(uid: string, email: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, {
      email,
      uid,
      createdAt: Timestamp.now(),
    });
  }

  /**
 * Retrieves a user's data from Firestore.
 * @param uid - The user's unique ID.
 * @returns An Observable of the user data.
 */
getUserData(uid: string): Observable<any> {
  const userRef = doc(this.firestore, `users/${uid}`);
  return from(getDoc(userRef)).pipe(
    map((doc) => doc.data()),
    catchError((error) => {
      console.error('Error fetching user data:', error);
      return throwError(() => new Error('Failed to fetch user data.'));
    })
  );
}


  /**
   * Updates a user's profile data in Firestore.
   * @param userData - An object containing the updated data.
   * @returns A Promise resolving when the user data is updated.
   */
  updateUser(userData: { name?: string; apiKey?: string }): Promise<void> {
    const currentUser = this.currentUserSubject.getValue();
    if (!currentUser) {
      return Promise.reject('No user is currently logged in.');
    }

    const userRef = doc(this.firestore, `users/${currentUser.uid}`);

    const updateData: any = {};
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.apiKey !== undefined) updateData.apiKey = userData.apiKey;

    return updateDoc(userRef, userData);
  }

  updateUserByUid(uid: string, userData: { name?: string; apiKey?: string }): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, userData);
  }

  /**
   * Stores a prompt-response pair in the current user's history.
   * @param prompt - The prompt given to the AI.
   * @param response - The AI's response.
   * @returns An Observable indicating the completion of the operation.
   */
  savePromptResponse(prompt: string, response: string): Observable<void> {
    const currentUser = this.currentUserSubject.getValue();
    if (!currentUser) {
      return throwError(() => new Error('No user is currently logged in.'));
    }

    const userHistoryCollection = collection(this.firestore, `users/${currentUser.uid}/history`);
    const historyData = {
      prompt,
      response,
      timestamp: Timestamp.now(),
    };

    return from(addDoc(userHistoryCollection, historyData)).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error('Error saving history:', error);
        return throwError(() => new Error('Failed to save prompt-response pair.'));
      })
    );
  }

  /**
   * Retrieves the prompt-response history for the current user.
   * @returns An Observable of the user's history.
   */
  getPromptResponseHistory(): Observable<any[]> {
    const currentUser = this.currentUserSubject.getValue();
    if (!currentUser) {
      return throwError(() => new Error('No user is currently logged in.'));
    }

    const userHistoryCollection = collection(this.firestore, `users/${currentUser.uid}/history`);

    const querySnapshot = query(userHistoryCollection, orderBy('timestamp', 'desc'));


    return from(
      getDocs(querySnapshot).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    );
  }
}
