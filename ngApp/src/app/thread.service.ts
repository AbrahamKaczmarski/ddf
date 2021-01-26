import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThreadService
{
  private _threadListUrl = "http://localhost:3000/threads"
  private _rawPostUrl = "http://localhost:3000/threads/posts"
  private _searchUrl = "http://localhost:3000/threads/search"

  constructor(private http: HttpClient) { }

  // -- threads

  getThreadList()
  {
    return this.http.get<any>(this._threadListUrl)
  }

  getThread(id: string, page: number)
  {
    let offset = page * 10 - 9
    return this.http.get<any>(`${this._threadListUrl}/${id}/${offset}-10`)
  }

  createThread(thread: any)
  {
    return this.http.post<any>(this._threadListUrl, thread)
  }

  editThread(id: string, thread: any)
  {
    return this.http.patch<any>(`${this._threadListUrl}/${id}`, thread)
  }

  deleteThread(id: string)
  {
    return this.http.delete<any>(`${this._threadListUrl}/${id}`)
  }

  // -- posts

  addPost(id: string, post: any)
  {
    return this.http.post<any>(`${this._threadListUrl}/${id}`, post)
  }

  deletePost(id: string)
  {
    return this.http.delete<any>(`${this._rawPostUrl}/${id}`)
  }

  // -- search

  searchByInput(input: any)
  {
    return this.http.post<any>(this._searchUrl, input)
  }

  searchByProfile(id: string)
  {
    return this.http.get<any>(`${this._searchUrl}/${id}`)
  }
}
