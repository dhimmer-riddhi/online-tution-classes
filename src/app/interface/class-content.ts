export interface ClassContent {

  standard: string
  subjectId: string
  title: string

  category?: string

  contents: {

    chapterNo: number
    chapterName: string

    content?: string;      // <-- ADD THIS

    concepts: {

      title: string

      contents: {

        contentTitle: string
        contentDefinition: string

        videos: {

          url: string
          fileName: string
          duration: number

          // 🔹 NEW FIELDS
          title?: string
          description?: string
          date?: string
          time?: string

          image?: string   // 🔹 Thumbnail Image

        }[]

      }[]

    }[]

  }[]

}
