import uuid, datetime
from django.db import models
from django.contrib.auth.models import User 
    
class Receiver(models.Model):
    username = models.CharField(max_length=200)
    full_name = models.CharField(max_length=200)
    employee_id = models.CharField(max_length=200, null=True, blank=True)
    contact_number = models.CharField(max_length=200, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='receivers', null=True, blank=True)
    def __str__(self):
        return self.username + " | " + self.full_name
    
class LeadVisitor(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='lead_visitors', null=True, blank=True)
    full_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    email = models.CharField(max_length=200, null=True, blank=True)
    contact_number = models.CharField(max_length=200)
    image = models.CharField(max_length=25000000, null=True, blank=True)
    official_documentation = models.FileField(upload_to='upload/', null=True, blank=True)
    visitee = models.CharField(max_length=200, null=True, blank=True)
    department = models.CharField(max_length=200, null=True, blank=True)
    visiting_date = models.DateField("Visiting Date", null=True, blank=True)
    visiting_time = models.TimeField("Visiting Time", null=True, blank=True)    
    unique_id = models.CharField(max_length=36, default=uuid.uuid4)
    valid_till = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.visiting_time:
            self.valid_till = datetime.datetime.combine(datetime.date.today(), self.visiting_time) + datetime.timedelta(hours=6)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name + " | " + self.unique_id

class Accompanying(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='accompanying_visitors', null=True, blank=True)
    lead_visitor_id = models.CharField(max_length=200, null=True, blank=True)
    full_name = models.CharField(max_length=200)
    email = models.CharField(max_length=200, null=True, blank=True)
    contact_number = models.CharField(max_length=200)
    unique_id = models.CharField(max_length=36, default=uuid.uuid4)
    image = models.CharField(max_length=25000000, null=True, blank=True)

    def __str__(self):
        return self.full_name + " | " + self.unique_id