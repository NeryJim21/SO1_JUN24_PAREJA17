#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/sysinfo.h> // ram 
#include <linux/seq_file.h>
#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("NeryJim21");
MODULE_DESCRIPTION("Proyecto1 - Modulo RAM");

struct sysinfo inf;

static int escribir_a_proc(struct seq_file *file_proc, void *v)
{
    unsigned long total, used, notused;
    unsigned long porc;
    si_meminfo(&inf);

    total = ((inf.totalram * inf.mem_unit)/1024)/1024;
    notused = ((inf.freeram * inf.mem_unit + inf.bufferram * inf.mem_unit + inf.sharedram * inf.mem_unit)/1024)/1024;
    used = total - notused;
    seq_printf(file_proc, "{\"used\":%lu, \"notused\":%lu }\n", used, notused);
    return 0;
}

static int abrir_aproc(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_a_proc, NULL);
}

// Operaciones de Kernel Superior a 5.6
static struct proc_ops archivo_operaciones = {
    .proc_open = abrir_aproc,
    .proc_read = seq_read
};

static int __init modulo_init(void)
{
    proc_create("ram_so1_jun2024", 0, NULL, &archivo_operaciones);
    printk(KERN_INFO "Modulo RAM insertado\n");
    return 0;
}

static void __exit modulo_cleanup(void)
{
    remove_proc_entry("ram_so1_jun2024", NULL);
    printk(KERN_INFO "Modulo RAM eliminado \n");
}

module_init(modulo_init);
module_exit(modulo_cleanup);

