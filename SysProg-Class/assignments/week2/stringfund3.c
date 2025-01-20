#include <stdio.h>
#include <string.h>
#include <stdbool.h>

//#define SPACE = (' ');
#define SIZE 60


int main() {
    char str[SIZE] = "Hello, World! Today Anthony Mayes";
    int len = strlen(str);

    // Using a for loop
  //  for (int i = 0; i < len; i++) {
//        printf("%c", str[i]); // Print each character
    //}
int i = 0;
int t = 0;
int wc = 0;
char * ptr;
int ch = ' ';
int wordsc = 1;
bool atBegWord = false;



ptr = strchr(str, ch);
    while (str[i] != '\0') {
  atBegWord = true;
        printf("%c", str[i]); // Print each character
        i++;

    if (str[i] == ch)
      {
        //wc = 1;
        wc++;
        wordsc = wc + 1;
      }

    }
printf("\n");
for (t = len - 1; t >=0; t--) {
         printf("%c", str[t]);
        }
    printf("\n");
    printf("number of spaces encounterd: %d\n",wc);
    printf("number of words: %d\n",wordsc);
    if (atBegWord = 1){
          printf("atBegWord: true");
                       }
    printf("\n");
    //printf("String Reversed : %s\n",strrev(str));
     return 0;
}
