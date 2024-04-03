enum Status {
  In_Process = "In_Process",
  Completed = "Completed",
  Coming_Soon = "Coming_Soon",
}

enum Genre {
  Drama = "Drama",
  Ecchi = "Ecchi",
  Action = "Action",
  Comedy = "Comedy",
  Fantasy = "Fantasy",
  Shounen = "Shounen",
  Adventure = "Adventure",
  Manhwa = "Manhwa",
  Manhua = "Manhua",
  Isekai = "Isekai",
  Harem = "Harem",
  Sci_Fi = "Sci_Fi",
  Seinen = "Seinen",
  Horror = "Horror",
  Mystery = "Mystery",
  Romance = "Romance",
  School_Life = "School_Life",
  Supernatural = "Supernatural",
  Detective = "Detective",
  Martial = "Martial",
  Swordsmanship = "Swordsmanship",
}

export enum ResponseStatus {
  "OK" = 200,
  "CREATED" = 201,
  "BAD REQUEST" = 400,
  "UNAUTHORIZED" = 401,
  "FORBIDDEN" = 403,
  "NOT FOUND" = 404,
  "TOO MANY REQUESTS" = 429,
  "INTERNAL SERVER ERROR" = 500,
  "BAD GATEWAY" = 502,
  "SERVICE UNAVAILABLE" = 503,
  "GATEWAY TIMEOUT" = 504,
}

export interface ReturnData {
  status: ResponseStatus;
  message: string;
  data?: any | null;
}
