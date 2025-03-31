import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCreateUpdateUserReqDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  id: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: `password only accepts english and number`,
  })
  pw: string;

  @IsString()
  @MaxLength(20)
  name: string;

  @IsString()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(20)
  phone: string;
}
