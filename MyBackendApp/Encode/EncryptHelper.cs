namespace MyBackendApp.Encode
{
    public class EncryptHelper{

        public string HashPassword(string pwd){
            return BCrypt.Net.BCrypt.HashPassword(pwd);
        }
        public bool Verify(string userpwd,string storedpwd){
            return BCrypt.Net.BCrypt.Verify(userpwd,storedpwd);
        }
    }

}
