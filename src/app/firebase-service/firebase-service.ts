import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  Query,
  UpdateData,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, firstValueFrom, from, map } from 'rxjs';
import { FirebaseCollections } from '../firebase-service/firebase-enum';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { Applications } from '../admin/manage-application/manage-application';
import { StudentRegistration } from '../interface/student-registration.interface';
import { Application } from '../interface/application';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) { }

  public getDocumentsByField<T extends DocumentData>(
    collectionName: FirebaseCollections,
    field: string,
    value: any
  ): Observable<T[]> {

    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where(field, '==', value));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as T[];
      })
    );

  }
  uploadVideo(file: any) {
    throw new Error('Method not implemented.');
  }
  // ===============================
  // ADD STUDENT REGISTRATION
  // ===============================
  public addStudent(formData: StudentRegistration) {
    return this.addDocument(
      FirebaseCollections.StudentRegistrations,
      formData
    );
  }



  // ✅ FIXED METHOD
  getApplicationById(appId: string): Observable<Application | undefined> {
    return this.getDocument<Application>(
      FirebaseCollections.Applications,
      appId
    );
  }

  // ===============================
  // GET COLLECTION
  // ===============================
  public getCollection<T extends DocumentData>(
    collectionName: FirebaseCollections
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const collectionQuery = query(collectionRef);
    return from(getDocs(collectionQuery)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];
      })
    );
  }

  // ===============================
  // GET DOCUMENT
  // ===============================
  public getDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string
  ): Observable<T | undefined> {

    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(collectionRef, documentId);

    return from(getDoc(docRef)).pipe(
      map((snapshot) => {
        if (!snapshot.exists()) {
          return undefined;
        }
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as unknown as T;
      })
    );
  }

  // ===============================
  // ADD DOCUMENT
  // ===============================
  public addDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    document: T
  ): Promise<DocumentReference<T>> {
    const collectionRef = collection(
      this.firestore,
      collectionName
    ) as CollectionReference<T, DocumentData>;

    return addDoc<T, DocumentData>(collectionRef, document);
  }

  // ===============================
  // UPDATE DOCUMENT
  // ===============================
  public updateDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string,
    document: UpdateData<T>
  ): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(
      collectionRef,
      documentId
    ) as DocumentReference<T, DocumentData>;

    return updateDoc(docRef, document);
  }

  // ===============================
  // DELETE DOCUMENT
  // ===============================
  public deleteDocument<T extends DocumentData>(
    collectionName: FirebaseCollections,
    documentId: string
  ): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(
      collectionRef,
      documentId
    ) as DocumentReference<T, DocumentData>;

    return deleteDoc(docRef);
  }

  // ===============================
  // FILE UPLOAD
  // ===============================
  async uploadFile(path: string, file: File) {

    const storage = getStorage();

    const storageRef = ref(storage, path);

    const uploadResult = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(uploadResult.ref);

    return { downloadURL };

}
getStudents(){
  return this.getCollection<any>(FirebaseCollections.StudentRegistrations);
}


}