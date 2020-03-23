# Backup notes
To backup your notes, do the following steps:

1. `pwd` To find the path of your existing installation. 
  * example output: `/home/user55/noteapp`
2. Open crontab: `crontab -e`
3. Add the following command (New Line). Replace `/home/user55/noteapp` with your own installation path
  * `* * * * * cd /home/user55/noteapp && ./scripts/backup.sh >> ./logs/backup.log`
