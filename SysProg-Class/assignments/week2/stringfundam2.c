#include <stdio.h>
#include <string.h>
#include <stdbool.h>

//#define SPACE = (' ');
#define SIZE 60
#define SIZE2 60


int main() {
    char str[SIZE] = " Hello, World! Today Anthony Mayes ";
    char str2[SIZE2] = "                                 ";
    int len = strlen(str);

    int i = 0;
    int r = 0;//number of char in each word
    int nw = 0;//number of word in list
    int wc = 0;
    char * ptr;
    int ch = ' ';
    int wordsc = 1;
    bool atBegWord = false;

ptr = strchr(str, ch);
    while (str[i] != '\0') {
        atBegWord = true;
        str2[i] = str[i];
        if (atBegWord = true != ch)
            {
             //printf("%d ",nw+1);
            }
        printf("%c", str[i]); // Print each character
        i++;
        r++;
        atBegWord = false;

    if (str[i] == ch)

      {
        r == i;
        nw++;
       if (atBegWord = true && ch)
         {
            printf("[%d] %c", nw, str[i]);
         }
       // printf("\n");
        printf("(%d)\n",r-1);
        wc++;
        wordsc = wc + 1;
        r=0;
      }

    }
   //printf("\n");
   //printf("number of spaces encounterd: %d\n",wc);
    //printf("number of words: %d\n",wordsc);

   //if (atBegWord = 1){
      //    printf("atBegWord: true");
                 //      }
    //printf("\n");
     return 0;
}
