from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from .models import LeadVisitor, Accompanying, Receiver
import datetime
from rest_framework import viewsets, status, generics
from .serializers import AllVisitorSerializer, LeadVisitorSerializer, AccompanyingSerializer, AccompanyingListSerializer, ReceiverSerializer, RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes

def index(request):
    return HttpResponse(f"<p>Hey! I see you're trying to access the API or the admin panel. I suggest you visit the <a href='https://aims.pythonanywhere.com/admin'>/admin</a> or <a href='https://aims.pythonanywhere.com/api'>/api</a> instead.<p>")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_user_by_phone(request):

    phone = request.GET.get('phone')
    if not phone:
        return Response({
            'error': 'Phone number is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        lead_visitor = LeadVisitor.objects.filter(contact_number=phone).order_by('-id').first()
        
        if lead_visitor:
            user_data = {
                'full_name': lead_visitor.full_name,
                'email': lead_visitor.email,
                'company_name': lead_visitor.company_name,
                'address': lead_visitor.address,
                'image': lead_visitor.image,
                'contact_number': lead_visitor.contact_number,
            }   
            return Response({
                'exists': True,
                'user': user_data,
                'message': 'User found with phone number'
            }, status=status.HTTP_200_OK)
        else:
            # User doesn't exist
            return Response({
                'exists': False,
                'message': 'No user found with this phone number'
            }, status=status.HTTP_200_OK)
         
    except Exception as e:
        return Response({
            'error': 'An error occurred while checking user details', 'details': str(e)
        }, 
        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RegisterSerializer
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class AllVisitorView(viewsets.ModelViewSet):
    queryset = LeadVisitor.objects.all()
    serializer_class = AllVisitorSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        if request.method == 'GET':
            unique_id = request.GET.get('unique_id', '')
            date = request.GET.get('date', '')
            from_date, to_date = request.GET.get('from_date', ''), request.GET.get('to_date', '')
            status = request.GET.get('status', '')
            message = "Query parameters found. Returning filtered visitors."
            if unique_id:
                lead_visitors = LeadVisitor.objects.filter(unique_id=unique_id)
                accompanying = Accompanying.objects.filter(lead_visitor_id=unique_id)
                if lead_visitors.count() == 0:
                    message = "NOT_FOUND: No visitor found with the given unique_id."
            elif date:
                lead_visitors = LeadVisitor.objects.filter(visiting_date=date)
                accompanying = Accompanying.objects.filter(lead_visitor_id__in=lead_visitors.values_list('unique_id', flat=True))
                if lead_visitors.count() == 0:
                    message = "NOT_FOUND: No visitor found with the given date."
            elif from_date and to_date:
                lead_visitors = LeadVisitor.objects.filter(visiting_date__range=[from_date, to_date])
                accompanying = Accompanying.objects.filter(lead_visitor_id__in=lead_visitors.values_list('unique_id', flat=True))
                if lead_visitors.count() == 0:
                    message = "NOT_FOUND: No visitor found with the given date range."
            else: 
                message = "No query parameters provided. Returning all visitors."
                lead_visitors = LeadVisitor.objects.all()
                accompanying = Accompanying.objects.all()
            
            combined_data = {
                'message': message,
                'lead_visitor': lead_visitors,
                'accompanying': accompanying
            }
        
        serializer = AllVisitorSerializer(combined_data)
        return Response(serializer.data)

    
class ReceiverViewSet(viewsets.ModelViewSet):
    queryset = Receiver.objects.all()
    serializer_class = ReceiverSerializer
    permission_classes = [IsAuthenticated]
    
    @csrf_exempt    
    def list(self, request):
        if request.method == 'GET':
            username = request.GET.get('username', '')
            if username:
                receivers = Receiver.objects.filter(username=username)
                serializer = ReceiverSerializer(receivers, many=True)
                return JsonResponse(serializer.data, safe=False)
            
            elif username == '':
                receivers = Receiver.objects.all()
                serializer = ReceiverSerializer(receivers, many=True)
                return JsonResponse(serializer.data, safe=False)
            
            else:
                return JsonResponse({'message': 'Receiver not found'})

class LeadVisitorViewSet(viewsets.ModelViewSet):
    queryset = LeadVisitor.objects.all()
    serializer_class = LeadVisitorSerializer
    permission_classes = [IsAuthenticated]
    
    @csrf_exempt
    def list(self, request):
        if request.method == 'GET':
            unique_id = request.GET.get('unique_id', '')
            from_date, to_date = request.GET.get('from_date', ''), request.GET.get('to_date', '')  
            date = request.GET.get('date', '')
            
            if unique_id:
                lead_visitors = LeadVisitor.objects.filter(unique_id=unique_id)
            elif date:
                lead_visitors = LeadVisitor.objects.filter(visiting_date=date)
            elif from_date and to_date:
                lead_visitors = LeadVisitor.objects.filter(visiting_date__range=[from_date, to_date])
            else:
                lead_visitors = LeadVisitor.objects.all()
            serializer = LeadVisitorSerializer(lead_visitors, many=True)
            return JsonResponse(serializer.data, safe=False)
        
class AccompanyingViewSet(viewsets.ModelViewSet):
    queryset = Accompanying.objects.all()
    serializer_class = AccompanyingListSerializer
    permission_classes = [IsAuthenticated]
    
    @csrf_exempt
    def list(self, request):
        if request.method == 'GET':
            unique_id = request.GET.get('unique_id', '')
            lead_visitor_id = request.GET.get('lead_visitor_id', '')
            if unique_id:
                accompanying_visitors = Accompanying.objects.filter(unique_id=unique_id)
                serializer = AccompanyingSerializer(accompanying_visitors, many=True)
                return JsonResponse(serializer.data, safe=False)
            elif lead_visitor_id:
                accompanying_visitors = Accompanying.objects.filter(lead_visitor_id=lead_visitor_id)
                serializer = AccompanyingSerializer(accompanying_visitors, many=True)
                return JsonResponse(serializer.data, safe=False)
            else:
                accompanying_visitors = Accompanying.objects.all()
                serializer = AccompanyingSerializer(accompanying_visitors, many=True)
                return JsonResponse(serializer.data, safe=False)

    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            print(dict(request.data))
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ExpiryView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @csrf_exempt
    def get(self, request, *args, **kwargs):
       
        if request.method == 'GET':
            
            unique_id = request.GET.get('unique_id', '')
           
            if unique_id == '':
                return JsonResponse({'message': 'unique_id not provided'})
          
            lead_visitor = LeadVisitor.objects.filter(unique_id=unique_id).first()
            print(unique_id)
            if lead_visitor:
                if lead_visitor.valid_till.replace(tzinfo=None) < datetime.datetime.now():
                    print(f"Expired: ID {unique_id} - expired_datetime: {lead_visitor.valid_till}")
                    return JsonResponse({'message': 'expired', 'expired_datetime': lead_visitor.valid_till, 'expired_time': lead_visitor.valid_till.time(), 'expired_date': lead_visitor.valid_till.date()})
                else:
                    print(f"Not Expired: ID {unique_id} - expiry_datetime: {lead_visitor.valid_till}")
                    return JsonResponse({'message': 'not expired', 'expiry_datetime': lead_visitor.valid_till, 'expiry_time': lead_visitor.valid_till.time(), 'expiry_date': lead_visitor.valid_till.date()})
            else:
                return JsonResponse({'message': 'not found'})
        else:
            return JsonResponse({'message': f'{request.method} not allowed. Only GET allowed'})