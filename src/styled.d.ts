// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    // 원하는 theme 속성 선언
    textColor: string;
    bgColor: string;
    accentColor: string;
  }
}
